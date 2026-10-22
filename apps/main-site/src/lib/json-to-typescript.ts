export interface JsonToTsOptions {
  rootName: string;
  useType: boolean;
}

interface FieldDef {
  key: string;
  tsType: string;
  optional: boolean;
}

interface TypeDef {
  name: string;
  fields: FieldDef[];
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (_, c: string) => c.toUpperCase());
}

function singularize(key: string): string {
  if (key.endsWith("ies")) return key.slice(0, -3) + "y";
  if (key.endsWith("ses") || key.endsWith("xes") || key.endsWith("zes")) return key.slice(0, -2);
  if (key.endsWith("s") && key.length > 3) return key.slice(0, -1);
  return key + "Item";
}

const VALID_TS_IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

function renderKey(key: string): string {
  return VALID_TS_IDENTIFIER.test(key) ? key : JSON.stringify(key);
}

function fieldsFromObject(obj: Record<string, unknown>, types: Map<string, TypeDef>): FieldDef[] {
  return Object.entries(obj).map(([key, value]) => {
    const { tsType, optional } = inferType(value, key, types);
    return { key, tsType, optional };
  });
}

function sameKeySet(fields: FieldDef[], obj: Record<string, unknown>): boolean {
  const a = new Set(fields.map((f) => f.key));
  const b = new Set(Object.keys(obj));
  if (a.size !== b.size) return false;
  for (const k of a) if (!b.has(k)) return false;
  return true;
}

function uniqueTypeName(base: string, types: Map<string, TypeDef>): string {
  if (!types.has(base)) return base;
  let i = 2;
  while (types.has(`${base}${i}`)) i++;
  return `${base}${i}`;
}

function mergeObjectShapes(objects: Record<string, unknown>[], types: Map<string, TypeDef>): FieldDef[] {
  const order: string[] = [];
  const byKey = new Map<string, { tsType: string; presentCount: number; optional: boolean }>();
  for (const obj of objects) {
    for (const [key, value] of Object.entries(obj)) {
      const { tsType, optional } = inferType(value, key, types);
      const existing = byKey.get(key);
      if (!existing) {
        order.push(key);
        byKey.set(key, { tsType, presentCount: 1, optional });
      } else {
        existing.presentCount++;
        if (existing.tsType !== tsType) existing.tsType = "unknown";
        existing.optional = existing.optional || optional;
      }
    }
  }
  return order.map((key) => {
    const v = byKey.get(key)!;
    return { key, tsType: v.tsType, optional: v.optional || v.presentCount < objects.length };
  });
}

function inferType(
  value: unknown,
  key: string,
  types: Map<string, TypeDef>
): { tsType: string; optional: boolean } {
  if (value === null || value === undefined) {
    return { tsType: "null", optional: true };
  }
  if (typeof value === "string") return { tsType: "string", optional: false };
  if (typeof value === "boolean") return { tsType: "boolean", optional: false };
  if (typeof value === "number") return { tsType: "number", optional: false };
  if (Array.isArray(value)) {
    if (value.length === 0) return { tsType: "unknown[]", optional: false };
    const allObjects = value.every((v) => v !== null && typeof v === "object" && !Array.isArray(v));
    if (allObjects) {
      const baseName = toPascalCase(singularize(key));
      const fields = mergeObjectShapes(value as Record<string, unknown>[], types);
      const typeName = registerType(baseName, fields, types);
      return { tsType: `${typeName}[]`, optional: false };
    }
    const inferred = value.map((v) => inferType(v, singularize(key), types));
    const uniqueTypes = new Set(inferred.map((i) => i.tsType));
    if (uniqueTypes.size !== 1) return { tsType: "unknown[]", optional: false };
    const [{ tsType }] = inferred;
    return { tsType: `${tsType}[]`, optional: false };
  }
  if (typeof value === "object") {
    const baseName = toPascalCase(key);
    const typeName = buildType(value as Record<string, unknown>, baseName, types);
    return { tsType: typeName, optional: false };
  }
  return { tsType: "unknown", optional: false };
}

// Registers `fields` under `baseName`, reusing that name only when an
// existing type there already has the exact same key set; otherwise a
// distinct name (Address2, Address3, ...) is registered so two unrelated
// shapes that happen to derive the same name never silently collapse into
// one — which previously dropped fields for arrays of differently-shaped
// objects, and could even self-reference the root type.
function registerType(baseName: string, fields: FieldDef[], types: Map<string, TypeDef>): string {
  const existing = types.get(baseName);
  if (!existing) {
    types.set(baseName, { name: baseName, fields });
    return baseName;
  }
  const existingKeys = new Set(existing.fields.map((f) => f.key));
  const newKeys = new Set(fields.map((f) => f.key));
  const sameShape = existingKeys.size === newKeys.size && [...existingKeys].every((k) => newKeys.has(k));
  if (sameShape) return baseName;
  const name = uniqueTypeName(baseName, types);
  types.set(name, { name, fields });
  return name;
}

function buildType(obj: Record<string, unknown>, baseName: string, types: Map<string, TypeDef>): string {
  if (types.has(baseName) && sameKeySet(types.get(baseName)!.fields, obj)) return baseName;
  const name = types.has(baseName) ? uniqueTypeName(baseName, types) : baseName;
  const fields: FieldDef[] = [];
  types.set(name, { name, fields });
  fields.push(...fieldsFromObject(obj, types));
  return name;
}

function renderType(def: TypeDef, opts: JsonToTsOptions, isRoot: boolean): string {
  const name = isRoot ? opts.rootName : def.name;
  const fieldLines = def.fields
    .map((f) => `  ${renderKey(f.key)}${f.optional ? "?" : ""}: ${f.tsType};`)
    .join("\n");

  if (opts.useType) {
    return `type ${name} = {\n${fieldLines}\n};`;
  }
  return `interface ${name} {\n${fieldLines}\n}`;
}

export function generateTypeScript(jsonStr: string, opts: JsonToTsOptions): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error(`Invalid JSON — ${(e as Error).message}`);
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Root value must be a JSON object {}.");
  }

  const types = new Map<string, TypeDef>();
  const rootTypeName = toPascalCase(opts.rootName);
  buildType(parsed as Record<string, unknown>, rootTypeName, types);

  const ordered = [
    ...Array.from(types.values()).filter((t) => t.name !== rootTypeName),
    ...(types.has(rootTypeName) ? [types.get(rootTypeName)!] : []),
  ];

  return ordered
    .map((def) => renderType(def, opts, def.name === rootTypeName))
    .join("\n\n");
}

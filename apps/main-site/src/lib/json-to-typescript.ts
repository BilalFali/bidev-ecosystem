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
    const inferred = value.map((v) => inferType(v, singularize(key), types));
    const uniqueTypes = new Set(inferred.map((i) => i.tsType));
    if (uniqueTypes.size !== 1) return { tsType: "unknown[]", optional: false };
    const [{ tsType }] = inferred;
    return { tsType: `${tsType}[]`, optional: false };
  }
  if (typeof value === "object") {
    const typeName = toPascalCase(key);
    buildType(value as Record<string, unknown>, typeName, types);
    return { tsType: typeName, optional: false };
  }
  return { tsType: "unknown", optional: false };
}

function buildType(obj: Record<string, unknown>, typeName: string, types: Map<string, TypeDef>): void {
  if (types.has(typeName)) return;
  const fields: FieldDef[] = [];
  types.set(typeName, { name: typeName, fields });
  for (const [key, value] of Object.entries(obj)) {
    const { tsType, optional } = inferType(value, key, types);
    fields.push({ key, tsType, optional });
  }
}

function renderType(def: TypeDef, opts: JsonToTsOptions, isRoot: boolean): string {
  const name = isRoot ? opts.rootName : def.name;
  const fieldLines = def.fields
    .map((f) => `  ${f.key}${f.optional ? "?" : ""}: ${f.tsType};`)
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

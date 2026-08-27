import { codeToHtml } from "shiki";

export async function CodeBlock({ code, language }: { code: string; language: string }) {
  const html = await codeToHtml(code, {
    lang: language,
    theme: "github-dark",
    transformers: [
      {
        pre(node) {
          const style = (node.properties.style as string | undefined) ?? "";
          node.properties.style = style.replace(/background-color:[^;]*;?/, "");
        },
      },
    ],
  });

  return (
    <div
      className="rounded-xl border border-border bg-bg-card text-sm overflow-x-auto [&_pre]:p-5 [&_pre]:m-0 [&_pre]:bg-transparent"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

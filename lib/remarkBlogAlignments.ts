import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export const BLOG_MARKDOWN_ALIGNMENTS = [
  "left",
  "right",
  "center",
  "justify",
] as const;

export type BlogMarkdownAlignment = (typeof BLOG_MARKDOWN_ALIGNMENTS)[number];

const ALIGN_CLASS: Record<BlogMarkdownAlignment, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
  justify: "text-justify",
};

function isAlignment(value: string): value is BlogMarkdownAlignment {
  return (BLOG_MARKDOWN_ALIGNMENTS as readonly string[]).includes(value);
}

type DirectiveNode = {
  type: string;
  name?: string;
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
  children?: unknown[];
};

/**
 * Maps `::: left|right|center|justify` containers to aligned `<div>` elements.
 */
export function remarkBlogAlignments() {
  return (tree: Root) => {
    visit(tree, (node) => {
      const directive = node as DirectiveNode;
      if (
        directive.type !== "containerDirective" ||
        typeof directive.name !== "string"
      ) {
        return;
      }

      const name = directive.name.trim().toLowerCase();
      if (!isAlignment(name)) {
        return;
      }

      const data = directive.data ?? (directive.data = {});
      data.hName = "div";
      data.hProperties = {
        ...(data.hProperties ?? {}),
        className: ["blog-align", ALIGN_CLASS[name]],
        "data-align": name,
      };
    });
  };
}

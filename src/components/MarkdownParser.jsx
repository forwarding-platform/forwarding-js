import React from "react";
import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import mdStyle from "@/styles/markdown.module.css";

export default function MarkdownParser({ children }) {
  return (
    <ReactMarkdown
      className={mdStyle.markdownStyle}
      remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {children}
    </ReactMarkdown>
  );
}

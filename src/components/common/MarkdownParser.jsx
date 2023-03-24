import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import mdStyle from "@/styles/markdown.module.css";
import remarkSimplePlantumlPlugin from "@akebifiky/remark-simple-plantuml";
import "katex/dist/katex.min.css";

export default function MarkdownParser({ children }) {
  return (
    <ReactMarkdown
      className={mdStyle.markdownStyle}
      remarkPlugins={[
        [remarkGfm, { singleTilde: false }],
        remarkMath,
        remarkSimplePlantumlPlugin,
      ]}
      rehypePlugins={[rehypeKatex]}
    >
      {children}
    </ReactMarkdown>
  );
}

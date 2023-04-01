import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import mdStyle from "@/styles/markdown.module.css";
import remarkSimplePlantumlPlugin from "@akebifiky/remark-simple-plantuml";
import "katex/dist/katex.min.css";
import { TypographyStylesProvider } from "@mantine/core";

export default function MarkdownParser({ children }) {
  return (
    <TypographyStylesProvider>
      <ReactMarkdown
        className={mdStyle.markdownStyle}
        remarkPlugins={[
          [remarkGfm, { singleTilde: false }],
          remarkMath,
          remarkSimplePlantumlPlugin,
        ]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: "h2",
          h2: "h3",
          h3: "h4",
          h4: "h5",
          h5: "h6",
          h6: "p",
        }}
      >
        {children}
      </ReactMarkdown>
    </TypographyStylesProvider>
  );
}

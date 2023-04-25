import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import mdStyle from "@/styles/markdown.module.css";
import remarkSimplePlantumlPlugin from "@akebifiky/remark-simple-plantuml";
import "katex/dist/katex.min.css";
import { TypographyStylesProvider } from "@mantine/core";
import { Prism } from "@mantine/prism";

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
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <Prism
                {...props}
                // eslint-disable-next-line react/no-children-prop
                children={String(children).replace(/\n$/, "")}
                language={match[1]}
              />
            ) : (
              <code {...props} className={className}>
                {children}
              </code>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </TypographyStylesProvider>
  );
}

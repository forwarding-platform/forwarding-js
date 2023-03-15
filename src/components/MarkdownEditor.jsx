import {
  Paper,
  SegmentedControl,
  Textarea,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownEditor() {
  const [md, setMd] = useState();
  const [mode, setMode] = useState("Combined");
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:gap-3">
          <TextInput className="flex-1" label="Select tags" />
          <TextInput className="flex-1" label="Title" />
        </div>
        <SegmentedControl
          className=" z-0"
          data={[
            {
              label: "Editor",
              value: "Editor",
            },
            {
              label: "Combined",
              value: "Combined",
            },
            {
              label: "Preview",
              value: "Preview",
            },
          ]}
          value={mode}
          onChange={(value) => setMode(value)}
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Textarea
            autosize
            minRows={10}
            placeholder="Your markdown content here"
            onChange={(e) => setMd(e.target.value)}
            value={md}
            className={`${
              mode == "Editor"
                ? "flex-1 "
                : mode == "Combined"
                ? "basis-1/2 "
                : "hidden"
            }`}
          />
          <Paper
            withBorder
            p="sm"
            className={`${
              mode == "Editor"
                ? "hidden "
                : mode == "Combined"
                ? "basis-1/2 "
                : "flex-1"
            }`}
          >
            <ReactMarkdown>{md}</ReactMarkdown>
          </Paper>
        </div>
      </div>
    </>
  );
}

import {
  Box,
  Button,
  Collapse,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownEditor() {
  const [md, setMd] = useState();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:gap-3">
        <TextInput className="flex-1" label="Select tags" />
        <TextInput className="flex-1" label="Title" />
      </div>
      <div className="flex flex-col sm:flex-row sm:gap-3">
        <Textarea
          autosize
          minRows={10}
          placeholder="Your markdown content here"
          onChange={(e) => setMd(e.target.value)}
          value={md}
          className="basis-1/2"
        />
        <Box className="basis-1/2">
          <ReactMarkdown>{md}</ReactMarkdown>
        </Box>
      </div>
    </div>
  );
}

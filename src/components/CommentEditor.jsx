import { Button, Group, Textarea } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useUser } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import MarkdownParser from "./common/MarkdownParser";

export default function CommentEditor() {
  const [value, setValue] = useState("");
  const user = useUser();
  const handlePreview = () => {
    modals.open({
      children: <MarkdownParser>{value}</MarkdownParser>,
    });
  };
  return (
    <>
      <Textarea
        maxRows={3}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Your comment"
        onFocus={(e) => {
          user ?? modals.openContextModal({ modal: "requireAuth" });
          e.target.blur();
        }}
      />
      <Group position="right" my="sm">
        <Button
          variant="light"
          disabled={value.length == 0}
          onClick={handlePreview}
        >
          Preview
        </Button>
        <Button disabled={value.length == 0}>Submit</Button>
      </Group>
    </>
  );
}

import { useAnswerCount } from "@/utils/hooks/answer";
import { Button, Group, Textarea } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import MarkdownParser from "./common/MarkdownParser";

export default function CommentEditor({ post, mutate }) {
  const [value, setValue] = useState("");
  const { mutate: mutateCount, answerCount } = useAnswerCount(post.id);
  const user = useUser();
  const handlePreview = () => {
    modals.open({
      children: <MarkdownParser>{value}</MarkdownParser>,
      size: "xl",
    });
  };
  const supabase = useSupabaseClient();
  const handleSubmit = async () => {
    if (!user) {
      return modals.openContextModal({ modal: "requireAuth" });
    }
    const { data, error } = await supabase
      .from("answer")
      .insert({
        content: value,
        profile_id: user.id,
        post_id: post.id,
      })
      .select("post_id");
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    if (data) {
      mutateCount(answerCount + 1);
      mutate();
      setValue("");
    }
  };
  return (
    <>
      <Textarea
        minRows={3}
        autosize
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Your answer in markdown"
        onFocus={(e) => {
          if (!user) {
            modals.openContextModal({ modal: "requireAuth" });
            e.target.blur();
          }
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
        <Button disabled={value.length == 0} onClick={handleSubmit}>
          Submit
        </Button>
      </Group>
    </>
  );
}

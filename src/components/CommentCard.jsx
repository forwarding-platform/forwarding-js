import { getTimeElapsed } from "@/utils/getTimeElapsed";
import { useAnswers } from "@/utils/hooks/answer";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Menu,
  rem,
  Stack,
  Text,
  Textarea,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  IconCheck,
  IconDots,
  IconFlag,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { mutate } from "swr";
import CommentEditor from "./CommentEditor";
import MarkdownParser from "./common/MarkdownParser";

export default function CommentCard({ comment, accepted }) {
  const router = useRouter();
  const theme = useMantineTheme();
  const user = useUser();
  const [editing, setEditing] = useState(false);
  const supabase = useSupabaseClient();
  const { mutate: mutateAnswer } = useAnswers(comment.post_id);
  const form = useForm({
    initialValues: {
      content: comment.content,
    },
  });
  const handleSubmit = form.onSubmit(async (values) => {
    const { data, error } = await supabase
      .from("answer")
      .update({
        content: values.content,
      })
      .eq("id", comment.id)
      .select("id");
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    if (data) {
      setEditing(false);
      mutateAnswer();
    }
  });
  const handlePreview = () => {
    modals.open({
      children: <MarkdownParser>{form.values.content}</MarkdownParser>,
      size: "xl",
    });
  };
  const handleDelete = () => {
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: <Text size="sm">Are you sure to delete this answer?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const { data, error } = await supabase
          .from("answer")
          .delete()
          .eq("id", comment.id);
        if (error) {
          console.log(error);
          throw new Error(error.message);
        } else {
          mutateAnswer();
        }
      },
      onCancel: () => modals.closeAll(),
    });
  };
  return (
    <>
      {accepted == comment.id && (
        <Badge color={theme.fn.primaryColor()} variant="filled" radius={0}>
          <Group spacing={5}>
            <IconCheck size={rem(14)} /> Accepted Answer
          </Group>
        </Badge>
      )}
      {editing ? (
        <form onSubmit={handleSubmit}>
          <Textarea minRows={3} autosize {...form.getInputProps("content")} />
          <Group my="sm" position="right">
            <Button
              variant="light"
              onClick={() => {
                form.reset();
                setEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="light"
              disabled={form.values.content.length == 0}
              onClick={handlePreview}
            >
              Preview
            </Button>
            <Button
              disabled={form.values.content.length == 0 || !form.isDirty()}
              type="submit"
            >
              Submit
            </Button>
          </Group>
        </form>
      ) : (
        <Card
          className="relative flex gap-4"
          shadow="md"
          radius="md"
          mb="sm"
          style={{
            borderTop:
              accepted == comment.id && `2px solid ${theme.fn.primaryColor()}`,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          <section>
            <UnstyledButton
              onClick={() => router.push(`/user/${comment.profile.username}`)}
              style={{
                border: `1px solid ${theme.fn.primaryColor()}`,
                borderRadius: "50%",
              }}
            >
              <Image
                src={
                  comment.profile.avatar_url
                    ? comment.profile.avatar_url.includes("googleusercontent")
                      ? comment.profile.avatar_url
                      : `https://kirkgtkhcjuemrllhngq.supabase.co/storage/v1/object/public/avatars/${comment.profile.avatar_url}`
                    : `https://robohash.org/${comment.profile.email}`
                }
                alt="svt"
                width={40}
                height={40}
                className="rounded-full"
              />
            </UnstyledButton>
          </section>
          <section>
            <Stack justify="center" spacing={0} mb="sm">
              <Text
                className="cursor-pointer font-medium hover:underline"
                size={"sm"}
                onClick={() => router.push(`/user/${comment.profile.username}`)}
              >
                {comment.profile.name}
              </Text>
              <Text size="xs" color="dimmed">
                {getTimeElapsed(comment.created_at)}
              </Text>
            </Stack>
            <MarkdownParser>{comment.content}</MarkdownParser>
          </section>
          {/* Menu */}
          <Menu withinPortal>
            <Menu.Target>
              <ActionIcon className="absolute top-0 right-0 mr-3 mt-2">
                <IconDots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>
                <Group spacing={5}>
                  <IconFlag strokeWidth={1.5} size={16} />
                  <Text>Report abuse</Text>
                </Group>
              </Menu.Item>
              {user && user.id == comment.profile_id && (
                <>
                  <Menu.Item onClick={() => setEditing(true)}>
                    <Group spacing={5}>
                      <IconEdit strokeWidth={1.5} size={16} />
                      <Text>Edit answer</Text>
                    </Group>
                  </Menu.Item>
                  <Menu.Item color="red" onClick={handleDelete}>
                    <Group spacing={5}>
                      <IconTrash strokeWidth={1.5} size={16} />
                      <Text>Delete answer</Text>
                    </Group>
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>
        </Card>
      )}
    </>
  );
}

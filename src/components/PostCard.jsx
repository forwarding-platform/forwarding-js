import { getTimeElapsed } from "@/utils/getTimeElapsed";
import { useAnswerCount } from "@/utils/hooks/answer";
import { useBookmark } from "@/utils/hooks/bookmark";
import { useLike } from "@/utils/hooks/like";
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";
import {
  IconHeartFilled,
  IconHearts,
  IconMessageCircle,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import BookmarkIcon from "./BookmarkIcon";
import HeartIcon from "./HeartIcon";

export default function PostCard({ post }) {
  const user = useUser();
  const router = useRouter();
  const theme = useMantineTheme();
  const { bookmarks, mutate: mutateBookmark } = useBookmark(user);
  const { answerCount } = useAnswerCount(post.id);
  const { likes, mutate: mutateLike } = useLike(user);
  return (
    <Card shadow="md" radius="md">
      <Group position="apart">
        <Group>
          <UnstyledButton
            onClick={() => router.push(`/user/${post.profile.username}`)}
            style={{
              border: `1px solid ${theme.fn.primaryColor()}`,
              borderRadius: "50%",
            }}
          >
            <Image
              src={
                post.profile.avatar_url
                  ? post.profile.avatar_url.includes("googleusercontent")
                    ? post.profile.avatar_url
                    : `https://kirkgtkhcjuemrllhngq.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`
                  : `https://robohash.org/${post.profile.email}`
              }
              alt="svt"
              width={40}
              height={40}
              className="rounded-full"
            />
          </UnstyledButton>
          <Stack justify="center" spacing={0}>
            <Text
              className="cursor-pointer font-medium hover:underline"
              size={"sm"}
              onClick={() => router.push(`/user/${post.profile.username}`)}
            >
              {post.profile.name}
            </Text>
            <Text size="xs" color="dimmed">
              {getTimeElapsed(post.created_at)}
            </Text>
          </Stack>
        </Group>
        <Group>
          {post.type === "blog" ? (
            <>
              <HeartIcon postId={post.id} likes={likes} mutate={mutateLike} />
              <BookmarkIcon
                postId={post.id}
                bookmarks={bookmarks}
                mutate={mutateBookmark}
              />
            </>
          ) : (
            <>
              <Tooltip label="Answer">
                <UnstyledButton component={Group} spacing={5}>
                  <Text>{answerCount ?? "0"}</Text>
                  <IconMessageCircle
                    strokeWidth={1.5}
                    color={theme.fn.primaryColor()}
                  />
                </UnstyledButton>
              </Tooltip>
              <BookmarkIcon
                postId={post.id}
                bookmarks={bookmarks}
                mutate={mutateBookmark}
              />
            </>
          )}
        </Group>
      </Group>
      <Box my={"sm"}>
        <Link
          href={
            post.type === "blog" ? `/post/${post.slug}` : `/qna/${post.slug}`
          }
          className=" hover:underline"
        >
          <Title order={3}>{post.title}</Title>
        </Link>
      </Box>
      <Group mb="sm">
        {post.post_tag.map((tag, index) => (
          <Badge variant="dot" size="sm" key={index}>
            {tag.tag.name}
          </Badge>
        ))}
      </Group>
    </Card>
  );
}

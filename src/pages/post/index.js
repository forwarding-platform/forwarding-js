import BookmarkIcon from "@/components/BookmarkIcon";
import Layout from "@/components/layouts/_layout";
import { supabase } from "@/libs/supabase";
import { getTimeElapsed } from "@/utils/getTimeElapsed";
import { useBookmark } from "@/utils/hooks/bookmark";
import { usePostPagination } from "@/utils/hooks/post";
import {
  Center,
  Container,
  Group,
  Loader,
  Select,
  TextInput,
  Stack,
  Button,
  Card,
  UnstyledButton,
  Text,
  Box,
  Title,
  Badge,
  Pagination,
} from "@mantine/core";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function PostsPage({ tags }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const supabase = useSupabaseClient();
  const router = useRouter();
  useEffect(() => {
    const getPageCount = async () => {
      const { count } = await supabase
        .from("post")
        .select("id", { count: "exact" })
        .eq("type", "blog");
      setTotalPage(Math.ceil(count / 10 - 1));
    };
    getPageCount();
  }, [supabase]);

  return (
    <Layout>
      <Container>
        <TextInput
          placeholder="Search posts"
          label="Search posts"
          type="search"
          onClick={() => router.push("/search")}
        />
        <Stack py="sm">
          <Page page={pageIndex} />
          <div className="hidden">
            <Page page={pageIndex + 1} />
          </div>
          <Pagination
            className="self-end"
            page={pageIndex}
            onChange={setPageIndex}
            total={totalPage}
          />
        </Stack>
      </Container>
    </Layout>
  );
}

function Page({ page }) {
  const { data, isLoading, error } = usePostPagination(page);
  const user = useUser();
  const router = useRouter();
  const { bookmarks, mutate } = useBookmark(user);
  if (isLoading) {
    return (
      <Layout>
        <Center h={"100vh"}>
          <Loader />
        </Center>
      </Layout>
    );
  }
  if (error) {
    console.log(error);
    return "An error occurs";
  }
  return data.data.map((post, index) => (
    <Card key={index} shadow="md" radius="md" mb="sm">
      <Group position="apart">
        <Group>
          <UnstyledButton
            onClick={() => router.push(`/user/${post.profile.username}`)}
            style={{ border: "1px solid", borderRadius: "50%" }}
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
        <BookmarkIcon postId={post.id} bookmarks={bookmarks} mutate={mutate} />
      </Group>
      <Box my={"sm"}>
        <Link href={`/post/${post.slug}`} className=" hover:underline">
          <Title order={3}>{post.title}</Title>
        </Link>
      </Box>
      <Group>
        {post.post_tag.map((tag, index) => (
          <Badge variant="dot" key={index}>
            {tag.tag.name}
          </Badge>
        ))}
      </Group>
    </Card>
  ));
}

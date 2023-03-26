import BookmarkIcon from "@/components/BookmarkIcon";
import Layout from "@/components/layouts/_layout";
import { supabase } from "@/libs/supabase";
import { getTimeElapsed } from "@/utils/getTimeElapsed";
import { useBookmark } from "@/utils/hooks/bookmark";
import {
  Badge,
  Box,
  Card,
  Center,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Search() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [rs, setRs] = useState();

  const handleSubmit = async () => {
    const { data: post, error } = await supabase
      .from("post")
      .select(
        "*, post_tag(tag(name)), profile!post_profile_id_fkey(username, avatar_url, email, name)"
      )
      .textSearch("title", searchValue, { type: "plain" })
      .order("created_at", { ascending: false });
    if (error) setRs([]);
    if (post) setRs(post);
  };

  return (
    <Layout>
      <Container>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <TextInput
            placeholder="search"
            label="Search posts"
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
        {rs ? (
          <>
            <Title order={3} my="md">
              Search result for {searchValue}:
            </Title>
            {rs.length !== 0 ? (
              <Stack>
                {rs.map((p, i) => (
                  <Page post={p} key={i} />
                ))}
              </Stack>
            ) : (
              <Center my="xl">
                <Text>Nothing found</Text>
              </Center>
            )}
          </>
        ) : null}
      </Container>
    </Layout>
  );
}

function Page({ post }) {
  const user = useUser();
  const router = useRouter();
  const { bookmarks, mutate } = useBookmark(user);
  return (
    <Card shadow="md" radius="md" mb="sm">
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
  );
}

import BookmarkIcon from "@/components/BookmarkIcon";
import TopTopButton from "@/components/common/TopTopButton";
import Layout from "@/components/layouts/_layout";
import { getTimeElapsed } from "@/utils/getTimeElapsed";
import { useBookmark } from "@/utils/hooks/bookmark";
import { useArticleInfiniteLoading } from "@/utils/hooks/post";
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
  Loader,
  Button,
  Anchor,
  ThemeIcon,
  ActionIcon,
} from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";
import { IconRefresh } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function QnAPage() {
  const { data, mutate, size, setSize, isLoading, isValidating } =
    useArticleInfiniteLoading("blog");
  const user = useUser();
  const router = useRouter();
  const { bookmarks, mutate: mutateBookmark } = useBookmark(user);
  const questions = data ? [].concat(...data) : [];
  if (isLoading) {
    return (
      <Layout>
        <Center h={"100vh"}>
          <Loader />
        </Center>
      </Layout>
    );
  }
  if (questions.length === 0)
    return (
      <Layout>
        <Center h={"100vh"}>No question uploaded</Center>
      </Layout>
    );
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 10);
  const isRefreshing = isValidating && data && data.length === size;
  console.log(questions.map((p) => p.id).length);
  return (
    <Layout>
      <Container>
        <TopTopButton />
        <TextInput
          placeholder="Search posts"
          label="Search posts"
          type="search"
          onClick={() => router.push("/search")}
        />
        <Stack py="sm">
          <Group>
            <ActionIcon disabled={isRefreshing} onClick={() => mutate()}>
              <IconRefresh strokeWidth={1.5} />
            </ActionIcon>
            <Text>
              Showing {isLoadingMore ? "..." : questions.length} questions
            </Text>
          </Group>

          {isEmpty ? <p>Yay, no issues found.</p> : null}
          {questions.map((post, index) => (
            <Card key={index} shadow="md" radius="md" mb="sm">
              <Group position="apart">
                <Group>
                  <UnstyledButton
                    onClick={() =>
                      router.push(`/user/${post.profile.username}`)
                    }
                    style={{ border: "1px solid", borderRadius: "50%" }}
                  >
                    <Image
                      src={
                        post.profile.avatar_url
                          ? post.profile.avatar_url.includes(
                              "googleusercontent"
                            )
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
                      onClick={() =>
                        router.push(`/user/${post.profile.username}`)
                      }
                    >
                      {post.profile.name}
                    </Text>
                    <Text size="xs" color="dimmed">
                      {getTimeElapsed(post.created_at)}
                    </Text>
                  </Stack>
                </Group>
                <BookmarkIcon
                  postId={post.id}
                  bookmarks={bookmarks}
                  mutate={mutateBookmark}
                />
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
          ))}
        </Stack>
        <Center>
          {isLoadingMore ? (
            <Loader />
          ) : (
            <Button
              disabled={isLoadingMore || isReachingEnd}
              onClick={() => setSize(size + 1)}
            >
              {isReachingEnd ? "There is no more question" : "Load more"}
            </Button>
          )}
        </Center>
      </Container>
    </Layout>
  );
}

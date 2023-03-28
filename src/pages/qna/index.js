import BookmarkIcon from "@/components/BookmarkIcon";
import TopTopButton from "@/components/common/TopTopButton";
import Layout from "@/components/layouts/_layout";
import { supabase } from "@/libs/supabase";
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
  Select,
  ScrollArea,
  MultiSelect,
  Chip,
} from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";
import { IconRefresh } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function QnAPage({ tags }) {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState([]);
  const { data, mutate, size, setSize, isLoading, isValidating } =
    useArticleInfiniteLoading("blog", search, tag);
  useEffect(() => {
    if (tag.length > 3) {
      setTag(tag.splice(1));
    }
  }, [tag]);
  const user = useUser();
  const router = useRouter();
  const { bookmarks, mutate: mutateBookmark } = useBookmark(user);
  const questions = data ? [].concat(...data) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 10);
  const isRefreshing = isValidating && data && data.length === size;
  return (
    <Layout>
      <Container size={"xl"}>
        <TopTopButton />
        <div className="flex w-full gap-2">
          <section className="grow">
            <TextInput
              placeholder="Search posts"
              label="Search posts"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              rightSection={isLoading && <Loader variant="oval" size={"sm"} />}
            />
            {questions.length == 0 && search.length != 0 ? (
              <Center my="lg">No question found</Center>
            ) : (
              <>
                <Stack py="sm">
                  <Group position="apart">
                    <Group>
                      <ActionIcon
                        disabled={isRefreshing}
                        onClick={() => mutate()}
                        title="Refresh"
                      >
                        <IconRefresh strokeWidth={1.5} />
                      </ActionIcon>
                      <Text>
                        Showing {isLoadingMore ? "..." : questions.length}{" "}
                        questions
                      </Text>
                    </Group>
                    <MultiSelect
                      maxSelectedValues={3}
                      label="Select tag"
                      className="lg:hidden"
                      placeholder="Filter by tag"
                      searchable
                      clearable
                      data={tags.map((t) => ({ label: t.name, value: t.id }))}
                      value={tag}
                      onChange={(val) => setTag(val)}
                    />
                  </Group>

                  {isEmpty ? (
                    <p>There is no question here</p>
                  ) : isLoading ? (
                    <Loader />
                  ) : null}
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
                        <Link
                          href={`/post/${post.slug}`}
                          className=" hover:underline"
                        >
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
                      {isReachingEnd
                        ? "There is no more question"
                        : "Load more"}
                    </Button>
                  )}
                </Center>
              </>
            )}
          </section>
          <ScrollArea className="hidden pt-10 pl-10 lg:block">
            <Chip.Group multiple value={tag} onChange={setTag}>
              {tags.map((t) => (
                <Chip
                  key={t.id}
                  value={t.id}
                  mt="sm"
                  checked={tag.includes(t.id.toString())}
                >
                  {t.name}
                </Chip>
              ))}
            </Chip.Group>
          </ScrollArea>
        </div>
      </Container>
    </Layout>
  );
}

export async function getStaticProps(ctx) {
  const { data, error } = await supabase.from("tag").select("*");
  if (error) throw new Error(error.message);
  return {
    props: {
      tags: data,
    },
  };
}

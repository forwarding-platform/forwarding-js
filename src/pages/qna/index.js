import Layout from "@/components/layouts/_layout";
import PostCard from "@/components/PostCard";
import { supabase } from "@/libs/supabase";
import { useArticleInfiniteLoading } from "@/utils/hooks/post";
import {
  ActionIcon,
  Button,
  Center,
  Chip,
  Container,
  Group,
  Loader,
  MultiSelect,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function QnAPage({ tags }) {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState([]);
  const { data, mutate, size, setSize, isLoading, isValidating } =
    useArticleInfiniteLoading("question", search, tag);
  useEffect(() => {
    if (tag.length > 3) {
      setTag(tag.splice(1));
    }
  }, [tag]);
  const questions = data ? [].concat(...data) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 10);
  const isRefreshing = isValidating && data && data.length === size;
  return (
    <>
      <Container size={"xl"}>
        <div className="flex w-full gap-2">
          <section className="grow">
            <TextInput
              placeholder="Search questions"
              label="Search questions"
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
                    <PostCard key={index} post={post} />
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
          <section className="hidden pl-5 lg:block">
            <Text className="font-bold">Filter by tags</Text>
            <ScrollArea className="">
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
          </section>
        </div>
      </Container>
    </>
  );
}

QnAPage.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps(ctx) {
  const { data, error } = await supabase.from("tag").select("*");
  if (error) throw new Error(error.message);
  return {
    props: {
      tags: data,
      metaTitle: "All Questions",
    },
  };
}

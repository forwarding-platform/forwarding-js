import BookmarkIcon from "@/components/BookmarkIcon";
import CommentCard from "@/components/CommentCard";
import CommentEditor from "@/components/CommentEditor";
import MarkdownParser from "@/components/common/MarkdownParser";
import HeartIcon from "@/components/HeartIcon";
import Layout from "@/components/layouts/_layout";
import { supabase } from "@/libs/supabase";
import { getTimeElapsed } from "@/utils/getTimeElapsed";
import { useAnswerCount, useAnswers } from "@/utils/hooks/answer";
import { useBookmark } from "@/utils/hooks/bookmark";
import { useLike } from "@/utils/hooks/like";
import {
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  IconArrowNarrowLeft,
  IconHeart,
  IconMessage,
  IconMessage2,
  IconMessageCircle,
} from "@tabler/icons-react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function QADetailPage({ post, morePost }) {
  const router = useRouter();
  const user = useUser();
  const theme = useMantineTheme();
  const { bookmarks, mutate } = useBookmark(user);
  const { answerCount } = useAnswerCount(post.id);
  const { scrollIntoView, targetRef } = useScrollIntoView();
  const supabase = useSupabaseClient();
  const {
    answers,
    mutate: mutateAnswer,
    isLoading: isAnswerLoading,
  } = useAnswers(post.id);
  if (answers?.length !== 0 && post.accepted_answer) {
    let i = 0;
    for (let j = 0; j < answers?.length; j++) {
      if (answers[j].id === post.accepted_answer) {
        // Swap the current element with the element at index i
        let temp = answers[j];
        answers[j] = answers[i];
        answers[i] = temp;
        i++;
      }
    }
  }
  const [related, setRelated] = useState([]);
  useEffect(() => {
    axios.post("/api/related_post", { postId: post.id }).then((result) => {
      supabase
        .from("post")
        .select("title, slug")
        .in("id", result.data.posts)
        .then((data) => {
          setRelated(data.data);
        });
    });
  }, [post.id]);
  return (
    <>
      <Container size={"xl"}>
        <Button
          variant="subtle"
          radius="md"
          mb="sm"
          onClick={() => {
            router.back();
          }}
          leftIcon={<IconArrowNarrowLeft strokeWidth={1.5} />}
        >
          Back
        </Button>

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
                    : `https://kirkgtkhcjuemrllhngq.supabase.co/storage/v1/object/public/avatars/${post.profile.avatar_url}`
                  : `https://robohash.org/${post.profile.email}`
              }
              alt="svt"
              width={40}
              height={40}
              className="rounded-full"
            />
          </UnstyledButton>
          <Stack justify="center" spacing={0}>
            <Group
              spacing={"xs"}
              className="cursor-pointer hover:underline"
              onClick={() => router.push(`/user/${post.profile.username}`)}
            >
              <Text className="font-medium" size={"sm"}>
                {post.profile.name}
              </Text>

              <Text color={"dimmed"} size="sm">
                {post.profile.username != post.profile.id &&
                  "@" + post.profile.username}
              </Text>
            </Group>
            <Text size="xs" color="dimmed">
              Posted {getTimeElapsed(post.created_at)}
              {post.updated_at &&
                "\t・\tUpdated " + getTimeElapsed(post.updated_at)}
            </Text>
          </Stack>
        </Group>
        <Divider my="md" />
        <div className={`flex flex-col gap-5 lg:flex-row`}>
          <section className="flex-1">
            <Title>{post.title}</Title>
            <Group my="sm" position="apart">
              <div>
                {post.post_tag.map((tag, index) => (
                  <Badge variant="dot" size="sm" key={index} mr="xs">
                    {tag.tag.name}
                  </Badge>
                ))}
              </div>
              <Group>
                <Tooltip label="Answer">
                  <UnstyledButton
                    component={Group}
                    spacing={5}
                    onClick={() => scrollIntoView()}
                  >
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
                  mutate={mutate}
                />
              </Group>
            </Group>
            <Card shadow="lg" radius="md">
              <MarkdownParser>{post.content}</MarkdownParser>
            </Card>
            <Center>
              <Anchor size="sm" color="dimmed" mt={"sm"}>
                Report abuse
              </Anchor>
            </Center>
            <Title order={3} my={"sm"} ref={targetRef}>
              Answers
            </Title>
            <div>
              <CommentEditor post={post} mutate={mutateAnswer} />
              {isAnswerLoading && (
                <Center>
                  <Loader />
                </Center>
              )}
              {answers?.map((a, i) => (
                <CommentCard post={post} key={i} comment={a} />
              ))}
            </div>
          </section>
          <section className="flex-none lg:relative lg:w-[300px]">
            <div className="lg:sticky lg:top-[65px]">
              {morePost?.length !== 0 && (
                <Card shadow="md">
                  <Text className="mb-3 font-semibold">
                    More from {post.profile.name}
                  </Text>
                  {morePost.map((p, i) => (
                    <Box key={i} my={"sm"}>
                      <Anchor
                        component={Link}
                        href={`/post/${p.slug}`}
                        className=" hover:underline-offset-4"
                      >
                        <Text size="sm">・ {p.title}</Text>
                      </Anchor>
                    </Box>
                  ))}
                </Card>
              )}
              {related.length !== 0 && (
                <Card shadow="md" mt={"sm"}>
                  <Text className="mb-3 font-semibold">You might like</Text>

                  {related.map((p, i) => (
                    <Box key={i} my={"sm"}>
                      <Anchor
                        component={Link}
                        href={`/post/${p.slug}`}
                        className="hover:underline-offset-4"
                      >
                        <Text size="sm">・ {p.title}</Text>
                      </Anchor>
                    </Box>
                  ))}
                </Card>
              )}
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}

QADetailPage.getLayout = (page) => <Layout>{page}</Layout>;

// export async function getStaticPaths() {
//   const { data: path } = await supabase
//     .from("post")
//     .select("slug")
//     .eq("type", "question");
//   const paths = path.map((p) => ({ params: { slug: p.slug.toString() } }));
//   return { paths, fallback: "blocking" };
// }

export async function getServerSideProps(ctx) {
  const { params } = ctx;
  const { data, error } = await supabase
    .from("post")
    .select(
      "*, post_tag!inner(tag_id, tag!inner(name)), profile!post_profile_id_fkey(username,id,email, avatar_url, name)"
    )
    .eq("slug", params.slug)
    .single();

  if (data) {
    const { data: morePost, error: morePostError } = await supabase
      .from("post")
      .select("title,slug")
      .eq("profile_id", data.profile.id)
      .eq("type", "question")
      .neq("slug", params.slug)
      .order("created_at", { ascending: false })
      .limit(3);
    if (morePostError) {
      console.log(morePostError);
      return {
        notFound: true,
      };
    }
    return {
      props: {
        post: data,
        morePost: morePost,
        metaTitle: data?.title || "Q & A",
      },
    };
  }

  if (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
}

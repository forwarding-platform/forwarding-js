import BookmarkIcon from "@/components/BookmarkIcon";
import Layout from "@/components/layouts/_layout";
import { supabaseAdmin } from "@/libs/adminSupabase";
import { getTimeElapsed } from "@/utils/getTimeElapsed";
import { useBookmark } from "@/utils/hooks/bookmark";
import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Stack,
  Text,
  Title,
  UnstyledButton,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useStyles = createStyles((theme) => ({
  link: {
    transition: "all ease 150ms",
    ":hover": {
      color: theme.fn.primaryColor(),
      textDecoration: "underline",
      textUnderlineOffset: "5px",
    },
  },
}));

export default function ExplorePage({ managerList }) {
  const { classes } = useStyles();
  const user = useUser();
  const router = useRouter();
  const theme = useMantineTheme();
  const { bookmarks, mutate: mutateBookmark } = useBookmark(user);
  const [recommend, setRecommend] = useState([]);
  const supabase = useSupabaseClient();
  const isManager = user && managerList.includes(user.id);
  useEffect(() => {
    if (user) {
      axios.post("/api/recommendation", { userId: user.id }).then((result) => {
        const isRecommendation = result.data.posts.length;
        if (isRecommendation > 0)
          supabase
            .rpc("get_top_liked_posts_in_array", {
              post_ids: [...result.data.posts],
            })
            .select("*")
            .then((data) => {
              setRecommend(data.data);
            });
        else
          supabase
            .rpc("get_top_liked_posts")
            .select("*")
            .then((data) => setRecommend(data.data));
      });
    } else {
      supabase
        .rpc("get_top_liked_posts")
        .select("*")
        .then((data) => setRecommend(data.data));
    }
  }, [supabase, user]);
  return (
    <Container py="md" size={"lg"}>
      {isManager && (
        <Button component={Link} target="_blank" href={"/manager/practice"}>
          Admin Panel
        </Button>
      )}
      {recommend?.length !== 0 && (
        <Title my="md">{user ? "Recommended for you" : "Top posts"}</Title>
      )}
      {recommend?.length == 0 && (
        <Center>
          <Loader />
        </Center>
      )}
      <Stack>
        {recommend &&
          recommend.map((post, i) => (
            <Card shadow="md" radius="md" key={i}>
              <Group position="apart">
                <Group>
                  <UnstyledButton
                    onClick={() => router.push(`/user/${post.username}`)}
                    style={{
                      border: `1px solid ${theme.fn.primaryColor()}`,
                      borderRadius: "50%",
                    }}
                  >
                    <Image
                      src={
                        post.avatar_url
                          ? post.avatar_url.includes("googleusercontent")
                            ? post.avatar_url
                            : `https://kirkgtkhcjuemrllhngq.supabase.co/storage/v1/object/public/avatars/${post.avatar_url}`
                          : `https://robohash.org/${post.email}`
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
                      onClick={() => router.push(`/user/${post.username}`)}
                    >
                      {post.name}
                    </Text>
                    <Text size="xs" color="dimmed">
                      {getTimeElapsed(post.created_at)}
                    </Text>
                  </Stack>
                </Group>
                <Group>
                  <BookmarkIcon
                    postId={post.id}
                    bookmarks={bookmarks}
                    mutate={mutateBookmark}
                  />
                </Group>
              </Group>
              <Box my={"sm"}>
                <Link
                  href={
                    post.type === "blog"
                      ? `/post/${post.slug}`
                      : `/qna/${post.slug}`
                  }
                  className=" hover:underline"
                >
                  <Title order={3}>{post.title}</Title>
                </Link>
              </Box>
            </Card>
          ))}
      </Stack>
    </Container>
  );
}

ExplorePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(ctx) {
  const { data, error } = await supabaseAdmin.from("manager").select("id");
  return {
    props: {
      metaTitle: "Explore",
      managerList: data?.map((d) => d.id) || [],
    },
  };
}

import BookmarkIcon from "@/components/BookmarkIcon";
import HeartIcon from "@/components/HeartIcon";
import Layout from "@/components/layouts/_layout";
import ProfileLayout from "@/components/layouts/_layout.profile";
import { supabase } from "@/libs/supabase";
import { getTimeElapsed } from "@/utils/getTimeElapsed";
import { useBookmark } from "@/utils/hooks/bookmark";
import { useLike } from "@/utils/hooks/like";
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Center,
  Group,
  Loader,
  Menu,
  Stack,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  IconCheck,
  IconDots,
  IconEdit,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ProfilePage({ profile }) {
  const router = useRouter();
  const theme = useMantineTheme();
  const supabase = useSupabaseClient();
  const user = useUser();
  const { bookmarks, mutate } = useBookmark(user);
  const { likes, mutate: mutateLike } = useLike(user);
  const handleDelete = (id) => {
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: <Text size="sm">Are you sure to delete this post?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => modals.closeAll(),
      onConfirm: async () => {
        const { error, data } = await supabase
          .from("post")
          .delete()
          .eq("id", id)
          .select("id")
          .single();
        if (data) {
          notifications.show({
            title: "Post deleted successfully",
            icon: <IconCheck />,
          });
          modals.closeAll();
        }
        if (error) {
          console.log(error);
          notifications.show({
            title: "Could not delete post",
            icon: <IconX />,
            color: "red",
          });
        }
      },
    });
  };
  if (router.isFallback)
    return (
      <>
        <Center h={"100vh"} component={Stack}>
          <Loader />
        </Center>
      </>
    );
  return (
    <ProfileLayout username={profile.username}>
      {/* <pre>{JSON.stringify(profile.post, null, 2)}</pre> */}
      {profile.post.length !== 0 ? (
        profile.post.map((post, index) => (
          <Card key={index} shadow="md" radius="md" mb="sm">
            <Group position="apart">
              <Group>
                <UnstyledButton
                  onClick={() => router.push(`/user/${profile.username}`)}
                  style={{ border: "1px solid", borderRadius: "50%" }}
                >
                  <Image
                    src={
                      profile.avatar_url
                        ? profile.avatar_url.includes("googleusercontent")
                          ? profile.avatar_url
                          : `https://kirkgtkhcjuemrllhngq.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`
                        : `https://robohash.org/${profile.email}`
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
                    onClick={() => router.push(`/user/${profile.username}`)}
                  >
                    {profile.name}
                  </Text>
                  <Text size="xs" color="dimmed">
                    {getTimeElapsed(post.created_at)}
                  </Text>
                </Stack>
              </Group>
              <Group spacing={3}>
                <HeartIcon postId={post.id} likes={likes} mutate={mutateLike} />
                <BookmarkIcon
                  postId={post.id}
                  bookmarks={bookmarks}
                  mutate={mutate}
                />
                {user && post.profile_id == user?.id && (
                  <Menu withinPortal width={200} withArrow>
                    <Menu.Target>
                      <ActionIcon>
                        <IconDots />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={() => router.push(`/editor/p/${post.slug}`)}
                      >
                        <Group>
                          <IconEdit strokeWidth={1.5} />
                          <Text size={"sm"}>Edit</Text>
                        </Group>
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Group>
                          <IconTrash strokeWidth={1.5} />
                          <Text size={"sm"}>Delete</Text>
                        </Group>
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                )}
              </Group>
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
        ))
      ) : (
        <Center> No posts yet</Center>
      )}
    </ProfileLayout>
  );
}

ProfilePage.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticPaths() {
  const { data: path } = await supabase.from("profile").select("username");
  const paths = path.map((p) => ({ params: { username: p.toString() } }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps(ctx) {
  const { params } = ctx;
  const { data, error } = await supabase
    .from("profile")
    .select("*,post!post_profile_id_fkey(*,post_tag(tag(name)))")
    .eq("username", params.username)
    .eq("post.type", "blog")
    .order("created_at", { foreignTable: "post", ascending: false })
    .single();

  if (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }

  return {
    props: {
      profile: data,
    },
  };
}

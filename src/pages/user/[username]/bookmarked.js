import Layout from "@/components/layouts/_layout";
import ProfileLayout from "@/components/layouts/_layout.profile";
import PostCard from "@/components/PostCard";
import { supabase } from "@/libs/supabase";
import { Center, Loader, Stack } from "@mantine/core";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function BookmarkPage({ username, userId }) {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const { data, isLoading, error } = useSWR(
    user ? `user-bookmark-${user.id}` : null,
    async () => {
      const { data, error } = await supabase
        .from("profile_bookmark")
        .select(
          "post_id, post(title, slug, id, post_tag(tag(name)), profile!post_profile_id_fkey(username, name, email, id, avatar_url))"
        )
        .eq("profile_id", user.id);
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      if (data) return data;
    }
  );
  if (router.isFallback)
    return (
      <>
        <Center h={"100vh"} component={Stack}>
          <Loader />
        </Center>
      </>
    );
  return (
    <ProfileLayout username={username} userId={userId}>
      <Stack>
        {isLoading ? (
          <Loader />
        ) : data?.length !== 0 ? (
          data?.map((b, index) => <PostCard post={b.post} key={index} />)
        ) : (
          <Center> No bookmarks yet</Center>
        )}
      </Stack>
    </ProfileLayout>
  );
}

BookmarkPage.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticPaths() {
  const { data: path } = await supabase.from("profile").select("username");
  const paths = path.map((p) => ({ params: { username: p.toString() } }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps(ctx) {
  const { params } = ctx;
  const { data, error } = await supabase
    .from("profile")
    .select("id")
    .eq("username", params.username)
    .single();
  return {
    props: {
      username: params.username,
      userId: data.id,
    },
    revalidate: 30,
  };
}

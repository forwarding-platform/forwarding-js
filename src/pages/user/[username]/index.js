import MarkdownParser from "@/components/MarkdownParser";
import Layout from "@/components/layouts/_layout";
import ProfileLayout from "@/components/layouts/_layout.profile";
import { supabase } from "@/libs/supabase";
import { Card, Center, Code, Loader, Stack } from "@mantine/core";
import { useRouter } from "next/router";

export default function ProfilePage({ username, posts }) {
  const router = useRouter();
  if (router.isFallback)
    return (
      <Layout>
        <Center h={"100vh"} component={Stack}>
          <Loader />
        </Center>
      </Layout>
    );
  return (
    <ProfileLayout username={username}>
      {posts.length !== 0 &&
        posts.map((post, index) => (
          <Card key={index}>
            <MarkdownParser>{post.content}</MarkdownParser>
          </Card>
        ))}
    </ProfileLayout>
  );
}

export async function getStaticPaths() {
  const { data: path } = await supabase.from("profile").select("username");
  const paths = path.map((p) => ({ params: { username: p.toString() } }));
  return { paths, fallback: true };
}

export async function getStaticProps(ctx) {
  const { params } = ctx;
  const { data, error } = await supabase
    .from("profile")
    .select("post(*)")
    .eq("username", params.username)
    .eq("post.type", "blog")
    .single();

  if (error)
    return {
      notFound: true,
    };

  return {
    props: {
      posts: data.post,
      username: params.username,
    },
  };
}

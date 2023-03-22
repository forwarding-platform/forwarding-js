import BookmarkIcon from "@/components/BookmarkIcon";
import MarkdownParser from "@/components/common/MarkdownParser";
import Layout from "@/components/layouts/_layout";
import { supabase } from "@/libs/supabase";
import { useBookmark } from "@/utils/hooks/bookmark";
import { Button, Container, Group, Title } from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/router";

export default function PostPage({ post }) {
  const router = useRouter();
  const user = useUser();
  const { bookmarks, mutate } = useBookmark(user);
  return (
    <Layout>
      <Container>
        <Group position="apart">
          <Button
            variant="subtle"
            radius="md"
            onClick={() => router.back()}
            leftIcon={<IconArrowNarrowLeft strokeWidth={1.5} />}
          >
            Back
          </Button>
          <BookmarkIcon
            postId={post.id}
            bookmarks={bookmarks}
            mutate={mutate}
          />
        </Group>
        <Title>{post.title}</Title>
        <MarkdownParser>{post.content}</MarkdownParser>
      </Container>
    </Layout>
  );
}

export async function getStaticPaths() {
  const { data: path } = await supabase.from("post").select("slug");
  const paths = path.map((p) => ({ params: { slug: p.slug.toString() } }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps(ctx) {
  const { params } = ctx;
  const { data, error } = await supabase
    .from("post")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post: data,
    },
  };
}

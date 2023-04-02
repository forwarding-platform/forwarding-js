import Layout from "@/components/layouts/_layout";
import { Container, SimpleGrid } from "@mantine/core";
import React from "react";

export default function QuizPage() {
  return (
    <>
      <Container>gfdf</Container>
    </>
  );
}

QuizPage.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps(ctx) {
  return {
    props: {
      metaTitle: "All Quizzes",
    },
  };
}

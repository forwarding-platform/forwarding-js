import Layout from "@/components/layouts/_layout";
import { supabaseAdmin } from "@/libs/adminSupabase";
import {
  Anchor,
  Card,
  Container,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import React from "react";

export default function QuizPage({ quizzes }) {
  return (
    <>
      <Container>
        <Title my="md">Practices</Title>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {quizzes.map((q) => (
            <Anchor
              key={q.id}
              component={Link}
              href={`/quiz/${q.slug}`}
              unstyled
            >
              <Card
                withBorder
                shadow="md"
                h="100px"
                radius="md"
                className="ease transition-all hover:-translate-y-1 "
                sx={(theme) => ({
                  "&:hover": {
                    borderColor: theme.fn.primaryColor(),
                  },
                })}
              >
                <div className="flex h-full flex-col justify-center ">
                  <Text
                    className="font-semibold"
                    sx={(theme) => ({ color: theme.fn.primaryColor() })}
                  >
                    {q.name}
                  </Text>
                  <Text size={"xs"} color="dimmed">
                    {q.question_count}{" "}
                    {q.question_count == 1 ? " question" : " questions"}
                    <br />
                  </Text>
                  <Text lineClamp={1} size="sm" color="dimmed">
                    {" "}
                    {q.description}
                  </Text>
                </div>
              </Card>
            </Anchor>
          ))}
        </div>
      </Container>
    </>
  );
}

QuizPage.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps(ctx) {
  const { data, error } = await supabaseAdmin
    .rpc("get_quiz_count_question")
    .select("*")
    .order("name");
  if (error) {
    console.log(error);
    throw new Error(error.message);
  }
  return {
    props: {
      quizzes: data,
      metaTitle: "All Quizzes",
    },
  };
}

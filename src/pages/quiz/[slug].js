import Layout from "@/components/layouts/_layout";
import { supabaseAdmin } from "@/libs/adminSupabase";
import {
  Alert,
  Box,
  Button,
  Card,
  Collapse,
  Container,
  Divider,
  Group,
  Image,
  Notification,
  Overlay,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { IconConfetti, IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

export default function QuizPlay({ quiz }) {
  const theme = useMantineTheme();
  const user = useUser();
  const supabase = useSupabaseClient();
  const totalScore = useMemo(
    () => quiz.quiz_question.reduce((a, b) => a.score + b.score),
    [quiz.quiz_question]
  );
  const [opened, { close, open, toggle }] = useDisclosure(false);
  const router = useRouter();
  const [time, setTime] = useState(0);
  const quizzes = useMemo(
    () =>
      quiz.quiz_question.map((q) => ({
        question: q.question,
        answers: q.quiz_answer,
        score: q.score,
      })),
    [quiz.quiz_question]
  );
  const t = new Date(time * 1000).toISOString().slice(11, 19);
  const [quizIndex, setQuizIndex] = useState(0);
  const [record, setRecord] = useState({ score: 0, data: [], time: 0 });
  useEffect(() => {
    const i = setInterval(() => setTime(time + 1), 1000);
    if (record.data.length == quizzes.length) clearInterval(i);
    return () => clearInterval(i);
  }, [time]);
  useEffect(() => {
    if (record.score == totalScore) {
      notifications.show({
        title: "Congratulations!",
        message: "You aced the quiz with a perfect score",
        icon: <IconConfetti />,
      });
    }
  }, [record.score, totalScore]);
  const handleSubmit = async () => {
    if (user) {
      const { data, error } = await supabase.from("quiz_record").insert({
        profile_id: user.id,
        quiz_id: quiz.id,
        score: record.score,
        time: record.time,
      });
      if (error) {
        console.log(error);
        notifications.show({
          title: "An error occurs",
          message: "Could not submit your record",
          icon: <IconX />,
          color: "red",
        });
      } else {
        notifications.show({
          title: "Record submitted successfully!",
          icon: <IconConfetti />,
        });
      }
    }
  };
  return (
    <Container className="flex h-full flex-col">
      <Box my="md" className="flex-none">
        <Title>{quiz.name}</Title>
        <Text color="dimmed">{quiz.quiz_question?.length} questions</Text>
        <Divider />
      </Box>
      {record.data.length == quizzes.length ? (
        <>
          <Alert color={theme.fn.primaryColor()} variant="filled">
            <Title order={2} align="center" mb="md">
              Your result
            </Title>
            <Title order={4} align="center">
              Total score: {record.score} / {totalScore}
            </Title>
            <Title order={4} align="center">
              Correct: {record.data.filter((d) => d.correct == true).length}/
              {record.data.length}
            </Title>
            <Title order={4} align="center">
              Time spent:{" "}
              {new Date(record.time * 1000).toISOString().slice(11, 19)}
            </Title>
          </Alert>
          <Group position="center" my="md">
            <Button variant="light" onClick={() => router.push("/quiz")}>
              Back to quizzes
            </Button>
            <Button variant="light" onClick={toggle}>
              Check your answers
            </Button>
            <Button
              variant="light"
              onClick={() => {
                setTime(0);
                setQuizIndex(0);
                setRecord({ score: 0, data: [], time: 0 });
                close();
              }}
            >
              Retry
            </Button>
            <Button disabled={record.score == 0} onClick={handleSubmit}>
              Submit your record
            </Button>
          </Group>
          <Collapse in={opened}>
            <Stack spacing={"sm"}>
              {record.data.map((r, index) => (
                <Alert
                  key={index}
                  color={r.correct ? "green" : "red"}
                  variant="outline"
                >
                  <Table highlightOnHover>
                    <thead>
                      <tr>
                        <th>
                          <Text className="font-bold">
                            {quizzes[index].question}
                          </Text>
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizzes[index].answers.map((a, j) => (
                        <tr key={j}>
                          <td>{a.content}</td>
                          <td>
                            {r.correct && r.selected == j
                              ? "[correct]"
                              : r.selected == j
                              ? "[selected]"
                              : a.correct
                              ? "[correct]"
                              : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Alert>
              ))}
            </Stack>
          </Collapse>
        </>
      ) : (
        <>
          <Text align="center" size={"sm"} color="dimmed">
            Question {quizIndex + 1} / {quizzes.length}
          </Text>
          <Title order={3} mb="xl" align="center">
            {quizzes[quizIndex].question}
          </Title>
          <Stack align="center">
            {quizzes[quizIndex].answers.map((a, i) => (
              <Button
                variant="light"
                fullWidth
                size="lg"
                className="self-center"
                key={i}
                onClick={() => {
                  setRecord({
                    score: a.correct
                      ? record.score + quizzes[quizIndex].score
                      : record.score,
                    data: [
                      ...record.data,
                      {
                        questionIndex: quizIndex,
                        correct: a.correct,
                        selected: i,
                      },
                    ],
                    time: time,
                  });
                  if (quizIndex < quizzes.length - 1)
                    setQuizIndex(quizIndex + 1);
                }}
              >
                <Text size="md">{a.content}</Text>
              </Button>
            ))}
          </Stack>
          <Group>
            <Text size="sm">{t}</Text>
          </Group>
        </>
      )}
    </Container>
  );
}

QuizPlay.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticPaths() {
  const { data, error } = await supabaseAdmin.from("quiz").select("slug");
  const paths = data.map((q) => ({ params: { slug: q.slug.toString() } }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps(ctx) {
  const { params } = ctx;
  const { data, error } = await supabaseAdmin
    .from("quiz")
    .select("id, name, quiz_question(*, quiz_answer(*))")
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
      metaTitle: data?.name || "Quizzes",
      quiz: data,
    },
    revalidate: 10,
  };
}

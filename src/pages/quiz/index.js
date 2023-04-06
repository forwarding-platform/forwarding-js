import QuizLeaderboard from "@/components/QuizLeaderboard";
import Layout from "@/components/layouts/_layout";
import { supabaseAdmin } from "@/libs/adminSupabase";
import {
  Anchor,
  Box,
  Button,
  Card,
  Container,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useRouter } from "next/router";

export default function QuizPage({ quizzes }) {
  const theme = useMantineTheme();
  return (
    <>
      <Container>
        <Title my="md">Quizzes</Title>
        {quizzes.map((q) => (
          <QuizCard quiz={q} key={q.id} />
        ))}
      </Container>
    </>
  );
}

QuizPage.getLayout = (page) => <Layout>{page}</Layout>;

export async function getServerSideProps(ctx) {
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

function QuizCard({ quiz }) {
  const { hovered, ref } = useHover();
  const router = useRouter();
  const handleLeaderboard = () => {
    modals.open({
      title: `${quiz.name} Leaderboard`,
      children: <QuizLeaderboard quizId={quiz.id} />,
      size: "lg",
    });
  };
  return (
    <Anchor unstyled ref={ref}>
      <Card
        withBorder
        shadow="md"
        radius="md"
        className="ease my-4 transition-all"
        sx={(theme) => ({
          "&:hover": {
            borderColor: theme.fn.primaryColor(),
          },
        })}
      >
        <div className="flex h-full flex-col sm:flex-row sm:items-center">
          <Box className="grow sm:pr-7">
            <Text
              className="text-lg font-semibold"
              sx={(theme) => ({ color: theme.fn.primaryColor() })}
              lineClamp={2}
            >
              {quiz.name}
            </Text>
            <Text size={"xs"} color="dimmed">
              {quiz.question_count}{" "}
              {quiz.question_count == 1 ? " question" : " questions"}
            </Text>
            <Text lineClamp={1} size="sm" color="dimmed">
              {" "}
              {quiz.description}
            </Text>
          </Box>
          <Stack spacing={"sm"}>
            <Button
              variant={hovered ? "filled" : "outline"}
              className="mt-4 w-full px-16 transition-all sm:mt-0 sm:w-auto"
              onClick={() => router.push(`/quiz/${quiz.slug}`)}
            >
              Play
            </Button>
            <Button
              variant={hovered ? "light" : "outline"}
              className="w-full px-16 transition-all sm:mt-0 sm:w-auto"
              onClick={handleLeaderboard}
            >
              Leaderboard
            </Button>
          </Stack>
        </div>
      </Card>
    </Anchor>
  );
}

import ChallengeLeaderboard from "@/components/ChallengeLeaderboard";
import Layout from "@/components/layouts/_layout";
import { supabaseAdmin } from "@/libs/adminSupabase";
import { supabase } from "@/libs/supabase";
import { useChallengeResult } from "@/utils/hooks/challenge";
import {
  Anchor,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Radio,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export default function PracticeGroup({ challenges, title }) {
  const [difficulty, setDifficulty] = useState("All");
  const [completion, setCompletion] = useState("All");
  const user = useUser();
  const { data } = useChallengeResult(user);
  const filteredList = useMemo(
    () =>
      challenges
        .filter((c) =>
          difficulty == "All" ? true : c.difficulty == difficulty
        )
        .filter((c) =>
          !data
            ? true
            : completion == "All"
            ? true
            : completion == "Incomplete"
            ? data.find((i) => i.practice_challenge_id !== c.id)
            : completion == "Partly Completed"
            ? data.find(
                (i) => i.practice_challenge_id == c.id && i.score < c.score
              )
            : data.find(
                (i) => i.practice_challenge_id == c.id && i.score == c.score
              )
        ),
    [challenges, completion, data, difficulty]
  );
  return (
    <>
      <Container size="lg">
        <Title my="md">{title}</Title>
        {filteredList.length == 0 && <Text>There is no challenges found.</Text>}
        <div className="flex w-full">
          <section className="w-full md:basis-2/3 lg:basis-3/4">
            {filteredList.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </section>
          <section className="hidden pl-10 md:sticky md:top-[65px] md:flex md:basis-1/3 md:flex-col md:self-start lg:basis-1/4">
            <Radio.Group
              name="difficultyFilter"
              label="Difficulty"
              value={difficulty}
              onChange={setDifficulty}
            >
              <Stack spacing="sm" mt="sm">
                <Radio value="Easy" label="Easy" />
                <Radio value="Medium" label="Medium" />
                <Radio value="Hard" label="Hard" />
                <Radio value="Expert" label="Expert" />
                <Radio value="All" label="All" />
              </Stack>
            </Radio.Group>
            <Divider my="lg" />
            <Radio.Group
              name="statusFilter"
              label="Status"
              value={completion}
              onChange={setCompletion}
            >
              <Stack spacing="sm" mt={"sm"}>
                <Radio value="Incomplete" label="Incomplete" />
                <Radio value="Partly Completed" label="Partly Completed" />
                <Radio value="Completed" label="Completed" />
                <Radio value="All" label="All" />
              </Stack>
            </Radio.Group>
          </section>
        </div>
      </Container>
    </>
  );
}

PracticeGroup.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticPaths() {
  const { data: path, error } = await supabase.from("practice").select("id");
  const paths = path.map((p) => ({
    params: { group: p.id.toString() },
  }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps(ctx) {
  const { params } = ctx;

  const { data: title, error: tError } = await supabase
    .from("practice")
    .select("title")
    .eq("id", params.group)
    .single();

  const { data: challenge, error } = await supabaseAdmin
    .from("practice_challenge")
    .select("id, title, score, slug, difficulty")
    .eq("practice_id", params.group);

  if (error || tError) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      challenges: challenge,
      title: title.title,
      metaTitle: title.title,
    },
    revalidate: 60 * 10,
  };
}

export function ChallengeCard({ challenge }) {
  const { hovered, ref } = useHover();
  const router = useRouter();
  const user = useUser();
  const { data } = useChallengeResult(user);
  const handleLeaderboard = () => {
    modals.open({
      title: `${challenge.title} Leaderboard`,
      children: <ChallengeLeaderboard challengeId={challenge.id} />,
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
              {challenge.title}
            </Text>
            <Group>
              <Text size={"sm"} color="dimmed">
                Score: {challenge.score}
              </Text>
              <Text size={"sm"} color="dimmed">
                Difficulty: {challenge.difficulty}
              </Text>
              {data && (
                <Text size={"sm"} color="dimmed">
                  {data.find((i) => i.practice_challenge_id !== challenge.id)
                    ? "[Incomplete]"
                    : data.find((i) => i.score < challenge.score)
                    ? `[Complete: ${(
                        (data.find(
                          (i) => i.practice_challenge_id == challenge.id
                        ).score /
                          challenge.score) *
                        100
                      ).toFixed(0)}%]`
                    : "[Completed]"}
                </Text>
              )}
            </Group>
          </Box>
          <Stack spacing={"sm"}>
            <Button
              variant={hovered ? "filled" : "outline"}
              className="mt-4 w-full px-16 transition-all sm:mt-0 sm:w-auto"
              onClick={() => router.push(`/challenge/${challenge.slug}`)}
            >
              Solve
            </Button>
            <Button
              variant={hovered ? "light" : "subtle"}
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

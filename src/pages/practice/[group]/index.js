import Layout from "@/components/layouts/_layout";
import { supabaseAdmin } from "@/libs/adminSupabase";
import { supabase } from "@/libs/supabase";
import {
  Anchor,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Group,
  Radio,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";

export default function PracticeGroup({ challenges, title }) {
  return (
    <Layout>
      <Container size="lg">
        <Title my="md">{title}</Title>
        {challenges.length == 0 && <Text>There is no challenges yet.</Text>}
        <div className="flex w-full">
          <section className="grow md:basis-2/3 lg:basis-3/4">
            {challenges.map((challenge) => (
              <Anchor
                key={challenge.id}
                component={Link}
                href={`/challenge/${challenge.slug}`}
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
                    <Group position="apart">
                      <Box>
                        <Text
                          className="text-lg font-semibold"
                          sx={(theme) => ({ color: theme.fn.primaryColor() })}
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
                        </Group>
                      </Box>
                      <Center>
                        <Button className="px-10">Solve</Button>
                      </Center>
                    </Group>
                  </div>
                </Card>
              </Anchor>
            ))}
          </section>
          <section className="hidden pl-10 sm:flex sm:basis-1/3 sm:flex-col lg:basis-1/4">
            <Radio.Group name="difficultyFilter" label="Difficulty">
              <Stack spacing="sm" mt="sm">
                <Radio value="Easy" label="Easy" />
                <Radio value="Medium" label="Medium" />
                <Radio value="Hard" label="Hard" />
                <Radio value="Expert" label="Expert" />
                <Radio value="All" label="All" />
              </Stack>
            </Radio.Group>
            <Divider my="lg" />
            <Radio.Group name="statusFilter" label="Status">
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
    </Layout>
  );
}

export async function getStaticPaths() {
  const { data: path, error } = await supabase.from("practice").select("id");
  const paths = path.map((p) => ({
    params: { group: p.id.toString() },
  }));
  return { paths, fallback: false };
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
    console.log(error);
    return {
      notFound: true,
    };
  }
  return {
    props: {
      challenges: challenge,
      title: title.title,
    },
  };
}

import Layout from "@/components/layouts/_layout";
import { supabaseAdmin } from "@/libs/adminSupabase";
import { Anchor, Card, Container, Text, Title } from "@mantine/core";
import Link from "next/link";

export default function PracticePage({ practices }) {
  return (
    <>
      <Container>
        <Title my="md">Practices</Title>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {practices
            .sort((a, b) => a.id - b.id)
            .map((practice) => (
              <Anchor
                key={practice.id}
                component={Link}
                href={`/practice/${practice.id}`}
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
                      {practice.title}
                    </Text>
                    <Text size={"sm"} color="dimmed">
                      {practice.challenge_count} challenge
                      {practice.challenge_count >= 2 && "s"}
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

PracticePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getStaticProps() {
  const { data, error } = await supabaseAdmin
    .rpc("get_practice_count_challenge")
    .select("*");
  return {
    props: {
      practices: data,
      metaTitle: "Practices",
    },
  };
}

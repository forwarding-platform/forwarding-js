import Layout from "@/components/layouts/_layout";
import { supabaseAdmin } from "@/libs/adminSupabase";
import { Card, Center, Container, Image, Text, Title } from "@mantine/core";
import React from "react";

export default function AchievementPage({ achievements }) {
  return (
    <Container>
      <Title my="md">Achievements</Title>
      <Center>{achievements.length == 0 && "No achievements yet"}</Center>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 ">
        {achievements.map((a, i) => (
          <Card shadow="sm" withBorder radius="md" padding={"lg"} key={i}>
            <Card.Section>
              <Image
                src={`https://kirkgtkhcjuemrllhngq.supabase.co/storage/v1/object/public/badges/${a.image_url}`}
                alt={a.description || a.name}
                height={150}
                fit="contain"
                p={"md"}
              />
            </Card.Section>
            <Title order={4} align="center">
              {a.name}
            </Title>
            <Text
              color="dimmed"
              align="center"
              size={"sm"}
              lineClamp={2}
              title={a.description}
            >
              {a.description ?? "-"}
            </Text>
          </Card>
        ))}
      </div>
    </Container>
  );
}

AchievementPage.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps(ctx) {
  const { data, error } = await supabaseAdmin.from("achievement").select("*");
  if (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
  return {
    props: {
      achievements: data || [],
      metaTitle: "Achievements",
    },
    revalidate: 60 * 5,
  };
}

import Layout from "@/components/layouts/_layout";
import { supabase } from "@/libs/supabase";
import {
  Anchor,
  Button,
  Card,
  Container,
  Group,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import React from "react";

export default function PracticePage({ practices }) {
  return (
    <Layout>
      <Container>
        <Title my="md">Practices</Title>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {practices.map((practice) => (
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
                    20 challenges
                  </Text>
                </div>
              </Card>
            </Anchor>
          ))}
        </div>
      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  const { data, error } = await supabase.from("practice").select("*");
  return {
    props: {
      practices: data,
    },
  };
}

import Layout from "@/components/layouts/_layout";
import { templateList } from "@/constants/sandpackTemplate";
import {
  Button,
  Center,
  Container,
  Loader,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

const CustomSandPack = dynamic(() => import("@/components/CustomSandPack"), {
  ssr: false,
  loading: () => (
    <Center h="100vh" component={Stack}>
      <Loader />
      <Text>Initializing...</Text>
    </Center>
  ),
});

export default function TemplatePage({ template }) {
  const [theme, setTheme] = useState("dark");
  return (
    <>
      <Container size="xl">
        <Title align="center" my="md">
          {template.name} Sandbox
        </Title>
        <div className="flex flex-col">
          <div className="mb-1 flex items-end justify-between">
            <Button
              component={Link}
              href="/sandbox"
              title="Back"
              variant="subtle"
              leftIcon={<IconArrowLeft strokeWidth={1.5} />}
            >
              Back
            </Button>
            <Select
              label="Select theme"
              defaultValue="auto"
              className="w-52"
              onChange={setTheme}
              value={theme}
              data={[
                { value: "dark", label: "Dark" },
                { value: "light", label: "Light" },
              ]}
            />
          </div>
        </div>
        <Paper withBorder>
          <CustomSandPack href={template.href} theme={theme} />
        </Paper>
      </Container>
    </>
  );
}

TemplatePage.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticPaths() {
  const paths = templateList.map((l) => ({ params: { template: l.href } }));
  return { paths, fallback: false };
}

export async function getStaticProps(ctx) {
  const { params } = ctx;
  const template = templateList.find((val) => val.href === params.template);
  return {
    props: {
      template: template,
      metaTitle: template?.name + " Sandbox" || "Sandbox",
    },
  };
}

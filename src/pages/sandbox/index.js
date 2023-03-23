import Layout from "@/components/layouts/_layout";
import { templateList } from "@/constants/sandpackTemplate";
import {
  Box,
  Card,
  Container,
  createStyles,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function SandboxPage() {
  const [searchValue, setSearchValue] = useState("");
  const filteredList = useMemo(
    () =>
      templateList.filter((l) =>
        l.name.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [searchValue]
  );
  return (
    <Layout>
      <Container>
        <div className="flex flex-col">
          <Title my="md">Nodejs Sandbox</Title>
          <Text>
            Node.js Sandbox allow you to compile and run modern JavaScript
            frameworks in the browser. Note that this sandbox only provide the
            minimum features but enough for you to test the JavaScript
            libraries/frameworks.
          </Text>
          <Title order={4} my="sm">
            Select a template
          </Title>
          <Box my="md" className=" md:w-4/7 w-1/2 self-end xl:w-1/3">
            <TextInput
              placeholder="Search template"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              icon={<IconSearch strokeWidth={1.5} />}
            />
          </Box>

          {filteredList.length !== 0 ? (
            <SimpleGrid
              breakpoints={[
                { maxWidth: "md", cols: 3 },
                { maxWidth: "lg", cols: 4 },
                { minWidth: "lg", cols: 5 },
              ]}
            >
              {filteredList.map((template) => (
                <TemplateCard template={template} key={template.name} />
              ))}
            </SimpleGrid>
          ) : (
            <Text align="center" color="dimmed">
              No templates found
            </Text>
          )}
        </div>
      </Container>
    </Layout>
  );
}

const useStyle = createStyles((theme) => ({
  card: {
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[1],
    },
  },
}));

function TemplateCard({ template }) {
  const { classes, cx } = useStyle();
  return (
    <Card
      component={Link}
      href={`/sandbox/${template.href}`}
      shadow="sm"
      p="md"
      radius="md"
      withBorder
      className={`flex flex-col items-center justify-center ${cx(
        classes.card
      )}`}
    >
      <div className="relative h-12 w-full">
        <Image src={template.src} fill alt={template.name} />
      </div>
      <Text mt="md">{template.name}</Text>
    </Card>
  );
}

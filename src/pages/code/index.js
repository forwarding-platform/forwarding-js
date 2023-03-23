import Layout from "@/components/layouts/_layout";
import { languageOptions } from "@/constants/languageOptions";
import {
  Button,
  Card,
  Center,
  Code,
  Container,
  Group,
  Loader,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { IconPlayerPlay } from "@tabler/icons-react";
import axios from "axios";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <Center h="100vh" component={Stack}>
      <Loader />
      <Text>Initializing...</Text>
    </Center>
  ),
});

export default function CodePage() {
  const { scrollIntoView, targetRef } = useScrollIntoView({ offset: 20 });
  const [selectedLang, setSelectedLang] = useState(languageOptions[0].value);
  const [selectedTheme, setSelectedTheme] = useState("vs-dark");
  const [code, setCode] = useState(languageOptions[0].default.runner);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState();

  const handleEditorChange = (tag, data) => {
    if (tag == "code") {
      setCode(data);
    } else {
      console.warn("Case not handled", tag, data);
    }
  };

  const executeCode = async (payload) => {
    setSubmitting(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_JUDGE_URL}/submissions?base64_encoded=true&wait=true`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((rs) => {
        setResult(rs.data);
        console.log(rs.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setSubmitting(false));
  };

  useEffect(() => result && scrollIntoView(), [result, scrollIntoView]);

  return (
    <Layout>
      <Container className="flex flex-col items-center" size="xl">
        <Title my="md">Code Runner</Title>
        <Group grow className="my-2 self-end">
          <Select
            title="Select language"
            label="Select language"
            data={languageOptions}
            value={selectedLang}
            onChange={setSelectedLang}
          />
          <Select
            title="Select theme"
            label="Select theme"
            data={[
              {
                label: "VS Dark",
                value: "vs-dark",
              },
              { label: "VS Light", value: "light" },
            ]}
            value={selectedTheme}
            onChange={setSelectedTheme}
          />
        </Group>
        <Center className="w-full grow">
          <CodeEditor
            lang={languageOptions.find((l) => l.value == selectedLang)?.name}
            theme={selectedTheme}
            onChange={handleEditorChange}
          />
        </Center>
        <Button
          // ref={runBtn}
          title="Run code"
          w="200px"
          mt="md"
          className="grow self-end"
          onClick={() => {
            executeCode({
              language_id: selectedLang,
              source_code: Buffer.from(code).toString("base64"),
              stdin: null,
            });
            setSubmitting(true);
          }}
          loading={submitting}
          leftIcon={<IconPlayerPlay size={16} />}
        >
          Run code
          {/* {(Ctrl+F9)} */}
        </Button>
        <Stack className="w-full" mt="sm">
          <Paper
            px={"sm"}
            pt="sm"
            shadow="md"
            ref={targetRef}
            className={`${result ? "visible" : "invisible"}`}
          >
            {result?.status.id !== 3 ? (
              <Text color="red" size="sm" className=" font-bold underline">
                {result?.status.description}
              </Text>
            ) : (
              <Text color="green" size="sm" className=" font-bold underline">
                Output
              </Text>
            )}
            {result?.stdout && (
              <pre pre className="whitespace-pre-wrap text-sm leading-tight">
                {Buffer.from(result?.stdout, "base64").toString()}
              </pre>
            )}
            {result?.stderr && (
              <pre className="whitespace-pre-wrap text-sm leading-tight text-red-500">
                {Buffer.from(result?.stderr, "base64").toString()}
              </pre>
            )}
            {result?.compile_output && (
              <pre
                className={`whitespace-pre-wrap text-sm leading-tight ${
                  result?.status.id !== 3 && "text-red-500"
                }`}
              >
                {Buffer.from(result?.compile_output, "base64").toString()}
              </pre>
            )}
          </Paper>
        </Stack>
      </Container>
    </Layout>
  );
}

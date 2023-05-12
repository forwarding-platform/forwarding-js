import MarkdownParser from "@/components/common/MarkdownParser";
import Layout from "@/components/layouts/_layout";
import { languageOptions } from "@/constants/languageOptions";
import { supabaseAdmin } from "@/libs/adminSupabase";
import { supabase } from "@/libs/supabase";
import {
  Alert,
  Anchor,
  Breadcrumbs,
  Button,
  Center,
  Code,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  IconChecks,
  IconChevronRight,
  IconConfetti,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <Center h="100vh" component={Stack}>
      <Loader />
      <Text>Initializing...</Text>
    </Center>
  ),
});

export default function ChallengePage({ challenge }) {
  const [selectedLang, setSelectedLang] = useState(languageOptions[0].value);
  const [selectedTheme, setSelectedTheme] = useState("vs-dark");
  const [code, setCode] = useState(languageOptions[0].default.practice);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState([]);
  const supabase = useSupabaseClient();
  const user = useUser();
  const isPassed =
    result.length > 3 &&
    result.filter((r) => r.status.id === 3).length >=
      Math.floor(result.length / 3);
  const isPassedAll =
    result.length > 3 &&
    result.filter((r) => r.status.id === 3).length == result.length;
  const score =
    result.length > 3 && isPassedAll
      ? challenge.score
      : Math.floor(
          (challenge.score / result.length) *
            result.filter((r) => r.status.id === 3).length
        );
  const time =
    result.length > 3 &&
    result.map((r) => Number.parseFloat(r.time)).reduce((a, b) => a + b);
  const { scrollIntoView, targetRef } = useScrollIntoView({ offset: 150 });
  const breadcrumbItems = [
    { title: "Practice", href: "/practice" },
    {
      title: challenge?.practice?.title,
      href: `/practice/${challenge?.practice?.id}`,
    },
    { title: challenge?.title, href: "#" },
  ];
  const handleEditorChange = (tag, data) => {
    if (tag == "code") {
      setCode(data);
    } else {
      console.warn("Case not handled", tag, data);
    }
  };

  useEffect(() => {
    if (result.length !== 0 && submitting == false) scrollIntoView();
  }, [submitting]);

  useEffect(() => {
    if (isPassedAll) {
      notifications.show({
        title: "Congratulations!",
        message: "You aced the challenge with a perfect score",
        icon: <IconConfetti />,
      });
    }
  }, [isPassedAll]);

  useEffect(() => {
    (async () => {
      if (isPassed && user) {
        const { data, error } = await supabase
          .from("practice_challenge_record")
          .insert({
            profile_id: user.id,
            score: score,
            practice_challenge_id: challenge.id,
            time: time,
            language:
              languageOptions.find((l) => l.value == selectedLang)?.name ||
              "Unknown",
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
    })();
  }, [isPassed]);

  const testCode = () => {
    setResult([]);
    setSubmitting(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_JUDGE_URL}/submissions?base64_encoded=true&wait=true`,
        {
          language_id: selectedLang,
          source_code: Buffer.from(code).toString("base64"),
          stdin:
            challenge.sample_input &&
            Buffer.from(challenge.sample_input).toString("base64"),
          expected_output:
            challenge.sample_output &&
            Buffer.from(challenge.sample_output).toString("base64"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      )
      .then((rs) => {
        setResult([rs.data]);
      })
      .catch((err) => console.log(err))
      .finally(() => setSubmitting(false));
  };

  const submitCode = () => {
    setResult([]);
    setSubmitting(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_JUDGE_URL}/submissions/batch?base64_encoded=true`,
        {
          submissions: challenge.inputs.map((input, i) => ({
            language_id: selectedLang,
            source_code: Buffer.from(code).toString("base64"),
            stdin: Buffer.from(input).toString("base64"),
            expected_output: Buffer.from(challenge.outputs[i]).toString(
              "base64"
            ),
          })),
        },
        {
          headers: {
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      )
      .then(
        (data) => {
          const tokens = data.data.map((t) => t.token).join(",");
          getResult(tokens);
        },
        (error) => {
          window.alert("An error occurs during submit");
          setSubmitting(false);
        }
      );
  };

  const getResult = (tokens) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_JUDGE_URL}/submissions/batch?tokens=${tokens}&base64_encoded=true&fields=stdout,stderr,status,expected_output,time,compile_output,stdin`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      )
      .then(
        (data) => {
          data.data.submissions.forEach((s) => {
            let status = s.status.id;
            if (status === 1 || status === 2) {
              setTimeout(() => getResult(tokens), 1000);
            } else {
              setResult(data.data.submissions);
              setSubmitting(false);
            }
          });
        },
        (error) => {
          window.alert("An error occurs during submit");
          setSubmitting(false);
        }
      );
  };

  return (
    <>
      <Container size="xl">
        <Breadcrumbs
          my="md"
          separator={<IconChevronRight strokeWidth={1} size={14} />}
        >
          {breadcrumbItems.map((item, index, arr) =>
            index == arr.length - 1 ? (
              <Text color="dimmed" size="sm" key={index}>
                {item?.title}
              </Text>
            ) : (
              <Anchor size="sm" component={Link} href={item.href} key={index}>
                {item?.title}
              </Anchor>
            )
          )}
        </Breadcrumbs>
        <Title>{challenge.title}</Title>
        <Group>
          <Text color="dimmed" size="sm">
            Score: {challenge.score}
          </Text>
          <Text color="dimmed" size="sm">
            Difficulty: {challenge.difficulty}
          </Text>
        </Group>
        <Divider mb={"md"} />
        <div className="grid w-full grid-cols-1 md:grid-cols-2">
          <Stack>
            <MarkdownParser>{challenge.content}</MarkdownParser>
            <Stack>
              <Title order={4}>Sample Input</Title>
              <pre className="m-0 whitespace-pre-wrap text-sm leading-tight">
                {challenge.sample_input}
              </pre>
              <Title order={4}>Sample Output</Title>
              <pre className="m-0 whitespace-pre-wrap text-sm leading-tight">
                {challenge.sample_output}
              </pre>
            </Stack>
          </Stack>
          <Stack className="">
            <Group grow className="m-2 self-end">
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
            <div className="max-w-full px-2">
              <CodeEditor
                lang={
                  languageOptions.find((l) => l.value == selectedLang)?.name
                }
                practice={true}
                theme={selectedTheme}
                onChange={handleEditorChange}
              />
            </div>
            <Group className="mx-2 self-end">
              <Button
                variant="outline"
                className="w-[200px]"
                onClick={testCode}
                loading={submitting}
              >
                Compile and Test
              </Button>
              <Button
                className="w-[200px]"
                loading={submitting}
                onClick={submitCode}
              >
                Submit
              </Button>
            </Group>
          </Stack>
        </div>
        {result.length !== 0 && result.length !== 1 && (
          <Alert
            variant="filled"
            my={"sm"}
            color={
              result.filter((r) => r.status.id === 3).length == result.length
                ? "green"
                : "red"
            }
          >
            You have passed {result.filter((r) => r.status.id === 3).length}/
            {result.length} test case{result.length !== 1 && "s"}
            <Text>Score: {score}</Text>
            <Text>Time consumed: {time.toFixed(3)}</Text>
          </Alert>
        )}
        <Stack className="w-full" mt="sm" ref={targetRef}>
          {result?.length !== 0 && result.some((r) => r.status.id > 4)
            ? [result.find((r) => r.status.id > 4)].map((rs) => (
                <Paper
                  key={0}
                  px={"sm"}
                  py="sm"
                  shadow="md"
                  sx={() => ({
                    border: "1px solid red",
                  })}
                >
                  <Group align="center" mb="sm">
                    <IconX strokeWidth={1.5} color="red" fill="red" />
                    <Text color="red" size="sm" className="font-bold">
                      {rs.status.description}
                    </Text>
                  </Group>
                  {rs.stderr && (
                    <Code block color="red">
                      {Buffer.from(rs.stderr, "base64").toString()}
                    </Code>
                  )}
                  {rs.compile_output && (
                    <Code block color="red">
                      {Buffer.from(rs.compile_output, "base64").toString()}
                    </Code>
                  )}
                </Paper>
              ))
            : result
                .slice(0, 3)
                .map((rs, index, arr) => (
                  <RenderResult
                    result={rs}
                    index={index}
                    arr={arr}
                    key={index}
                    sample_output={challenge.sample_output}
                  />
                ))}
        </Stack>
      </Container>
    </>
  );
}

ChallengePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getStaticPaths() {
  const { data } = await supabaseAdmin
    .from("practice_challenge")
    .select("slug");
  const paths = data.map((p) => ({ params: { slug: p.slug.toString() } }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps(ctx) {
  const { params } = ctx;
  const { data, error } = await supabaseAdmin
    .from("practice_challenge")
    .select("*, practice(id, title)")
    .eq("slug", params.slug.toString())
    .single();
  if (error || !data) {
    console.log(error);
    return {
      notFound: true,
    };
  }
  return {
    props: {
      challenge: data,
      metaTitle: data?.title || "Challenge",
    },
    revalidate: 30,
  };
}

/**
 *
 * @param {{result: {stdin:string, expected_output:string,stdout:string,status:{id:number,description:string}, compile_output:string, stderr: string}, index: number, arr: Array, sample_output:string}} param0
 */
function RenderResult({ result, index, arr, sample_output }) {
  return (
    <Paper
      px={"sm"}
      py="sm"
      shadow="md"
      sx={() => ({
        border: result.status.id !== 3 ? "1px solid red" : "1px solid green",
      })}
    >
      {result.status.id === 3 ? (
        <Group align="center" mb="sm">
          <IconChecks strokeWidth={1.5} color="green" />
          <Text color="green" size="sm" className="font-bold">
            Correct
          </Text>
        </Group>
      ) : (
        <Group align="center" mb="sm">
          <IconX strokeWidth={1.5} color="red" fill="red" />
          <Text color="red" size="sm" className="font-bold">
            {result.status.description}
          </Text>
        </Group>
      )}
      {result.status.id === 4 || result.status.id === 3 ? (
        <>
          {result.stdin && (
            <>
              <Text>Input</Text>
              <Code block>
                {Buffer.from(result.stdin, "base64").toString()}
              </Code>
            </>
          )}
          <Text>Your output</Text>
          {result.stdout && (
            <Code block color={result.status.id === 4 ? "red" : "green"}>
              {Buffer.from(result.stdout, "base64").toString()}
            </Code>
          )}
          {result.compile_output && (
            <Code block color={result.status.id === 4 ? "red" : "green"}>
              {Buffer.from(result.compile_output, "base64").toString()}
            </Code>
          )}
          <Text>Expected output</Text>

          {result.expected_output ? (
            <Code block color={result.status.id === 4 ? "red" : "green"}>
              {Buffer.from(result.expected_output, "base64").toString()}
            </Code>
          ) : (
            <Code block color={result.status.id === 4 ? "red" : "green"}>
              {sample_output}
            </Code>
          )}
        </>
      ) : (
        <>
          {result.stderr && (
            <Code block color="red">
              {Buffer.from(result.stderr, "base64").toString()}
            </Code>
          )}
          {result.compile_output && (
            <Code block color="red">
              {Buffer.from(result.compile_output, "base64").toString()}
            </Code>
          )}
        </>
      )}
    </Paper>
  );
}

import Layout from "@/components/_layout";
import { supabase } from "@/libs/supabase";
import {
  ActionIcon,
  Affix,
  Anchor,
  Button,
  Container,
  Divider,
  Group,
  MultiSelect,
  rem,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useWindowScroll } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconArrowNarrowLeft,
  IconChevronUp,
  IconEyeCheck,
  IconHelp,
  IconHelpSmall,
  IconQuestionMark,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function EditorPage({ tags }) {
  const [md, setMd] = useState();
  const [{ y }, scrollTo] = useWindowScroll();
  const theme = useMantineTheme();
  const router = useRouter();
  const form = useForm({
    initialValues: {
      postTag: [],
      title: "",
      content: "",
    },
    validate: {
      postTag: (value) =>
        value.length === 0 ? "Select at least one tag" : null,
    },
    validateInputOnBlur: true,
  });
  const handleFormSubmit = form.onSubmit((values) => {
    console.log(values);
  });
  return (
    <Layout>
      <Container>
        <Group>
          <ActionIcon
            variant="light"
            size="lg"
            radius="xl"
            onClick={() => router.back()}
          >
            <IconArrowNarrowLeft strokeWidth={1.5} />
          </ActionIcon>
          <Title>Markdown Editor</Title>
        </Group>
        <Divider mb="md" />
        <Affix position={{ bottom: rem(20), right: rem(20) }} zIndex={20000000}>
          <Transition transition="slide-up" mounted={y > 0}>
            {(transitionStyles) => (
              <ActionIcon
                title="Scroll to top"
                size="xl"
                radius="xl"
                style={transitionStyles}
                onClick={() => scrollTo({ y: 0 })}
              >
                <IconChevronUp strokeWidth={1.5} />
              </ActionIcon>
            )}
          </Transition>
        </Affix>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-1">
          <MultiSelect
            searchable
            required
            data={tags.map((t) => ({ value: t.id, label: t.name }))}
            placeholder="Select at least 1 tag, up to 3 tags"
            className="flex-1"
            label="Select tags"
            maxSelectedValues={3}
            {...form.getInputProps("postTag", { type: "checkbox" })}
          />
          <Group position="right">
            <Text size="sm">
              Want to contribute new tag? <Anchor>Request tag</Anchor>
            </Text>
          </Group>
          <TextInput
            required
            className="flex-1"
            label="Title"
            {...form.getInputProps("title")}
            onBlur={(e) => form.setFieldValue("title", e.target.value.trim())}
          />
          <div className="mt-2 self-end">
            <Group>
              <ActionIcon
                component={Tooltip}
                label="Markdown Cheat Sheet"
                variant="outline"
                color={theme.primaryColor}
              >
                <IconHelpSmall strokeWidth={1.5} />
              </ActionIcon>
              <Tooltip label="Preview">
                <ActionIcon
                  disabled={!md?.length}
                  variant="outline"
                  color={theme.primaryColor}
                  onClick={() =>
                    modals.open({
                      title: "Preview",
                      children: <ReactMarkdown>{md}</ReactMarkdown>,
                      size: "xl",
                    })
                  }
                >
                  <IconEyeCheck strokeWidth={1.5} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </div>
          <Textarea
            autosize
            minRows={10}
            placeholder="Your markdown content here"
            onChange={(e) => setMd(e.target.value)}
            value={md}
          />
          <div className="self-end">
            <Group>
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Post</Button>
            </Group>
          </div>
        </form>
      </Container>
    </Layout>
  );
}

export async function getStaticProps(ctx) {
  const { data, error } = await supabase.from("tag").select("*");
  if (error) throw new Error(error.message);
  return {
    props: {
      tags: data,
    },
  };
}

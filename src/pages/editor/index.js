import Layout from "@/components/_layout";
import {
  ActionIcon,
  Affix,
  Container,
  Divider,
  Group,
  rem,
  Textarea,
  TextInput,
  Title,
  Tooltip,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconChevronUp,
  IconEyeCheck,
  IconHelp,
  IconHelpSmall,
  IconQuestionMark,
} from "@tabler/icons-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function EditorPage() {
  const [md, setMd] = useState();
  const [{ y }, scrollTo] = useWindowScroll();
  const theme = useMantineTheme();
  return (
    <Layout>
      <Container>
        <Title>Markdown Editor</Title>
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
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:gap-3">
            <TextInput className="flex-1" label="Select tags" />
            <TextInput className="flex-1" label="Title" />
          </div>
          <div className="self-end">
            <Group>
              <ActionIcon
                component={Tooltip}
                label="Markdown Cheat Sheet"
                variant="outline"
                color={theme.primaryColor}
              >
                <IconHelpSmall strokeWidth={1.5} />
              </ActionIcon>
              <ActionIcon
                component={Tooltip}
                label="Preview"
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
            </Group>
          </div>
          <Textarea
            autosize
            minRows={10}
            placeholder="Your markdown content here"
            onChange={(e) => setMd(e.target.value)}
            value={md}
          />
        </div>
      </Container>
    </Layout>
  );
}

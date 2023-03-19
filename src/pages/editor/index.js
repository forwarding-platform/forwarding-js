import UploadImage from "@/components/UploadImage";
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
import { closeAllModals, closeModal, modals } from "@mantine/modals";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  IconArrowNarrowLeft,
  IconChevronUp,
  IconHelpSmall,
  IconPhotoPlus,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import mdStyle from "@/styles/markdown.module.css";
import { useEffect, useState } from "react";

export default function EditorPage({ tags }) {
  const [{ y }, scrollTo] = useWindowScroll();
  const theme = useMantineTheme();
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [images, setImages] = useState([]);
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

  /**
   *
   * @param {File} file
   */
  const handleLocalImage = async (file) => {
    // if (user) {
    //   const { data, error } = await supabase.storage
    //     .from("post-img")
    //     .upload(`${user.id}/${Date.now()}`, file, {
    //       cacheControl: "36000",
    //     });
    //   if (error) {
    //     closeModal("upload-post-image");
    //     return window.alert("Error occurs when upload image!");
    //   }
    //   // https://kirkgtkhcjuemrllhngq.supabase.co/storage/v1/object/public/post-img/3b045270-33e0-4431-b827-ec310df3dc5c/1679222223223
    //   if (data) {
    //     form.setFieldValue(
    //       "content",
    //       form.values.content +
    //         `![Image alt text](https://kirkgtkhcjuemrllhngq.supabase.co/storage/v1/object/public/post-img/${data.path}) "Image title"`
    //     );
    //     closeModal("upload-post-image");
    //     return;
    //   }
    // }
    const imgUrl = URL.createObjectURL(file);
    form.setFieldValue(
      "content",
      form.values.content + `![Alt text](${imgUrl}) "Image title"\n`
    );
    setImages((current) => [...current, imgUrl]);
    closeAllModals();
  };
  const handleFormSubmit = form.onSubmit((values) => {
    console.log("images", images);
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
          <div className="mt-2 mb-0 self-end">
            <Group spacing={"xs"}>
              <ActionIcon
                component={Tooltip}
                label="Markdown Cheat Sheet"
                variant="outline"
                color={theme.primaryColor}
              >
                <IconHelpSmall strokeWidth={1.5} />
              </ActionIcon>
              <Tooltip label="Upload image">
                <ActionIcon
                  variant="outline"
                  color={theme.primaryColor}
                  onClick={() =>
                    modals.open({
                      title: "Upload image",
                      children: (
                        <UploadImage handleLocalImage={handleLocalImage} />
                      ),
                      modalId: "upload-post-image",
                    })
                  }
                >
                  <IconPhotoPlus strokeWidth={1.5} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </div>
          <div className="relative">
            <Textarea
              autosize
              minRows={10}
              placeholder="Your markdown content here"
              {...form.getInputProps("content")}
            />
          </div>
          <Text color="dimmed" size="sm">
            <b>Important:</b> Please do not modify image urls that are uploaded
            from your device, it may corrupt your post content.
          </Text>
          <div className="mt-2 self-end">
            <Group>
              <Button variant="outline">Cancel</Button>
              <Button
                disabled={form.values.content.length == 0}
                variant="outline"
                color={theme.primaryColor}
                onClick={() =>
                  modals.open({
                    title: "Preview",
                    children: (
                      <ReactMarkdown className={mdStyle.markdownStyle}>
                        {form.values.content}
                      </ReactMarkdown>
                    ),
                    size: "xl",
                  })
                }
              >
                Preview
              </Button>
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

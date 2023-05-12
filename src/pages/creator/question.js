import MarkdownParser from "@/components/common/MarkdownParser";
import UploadImage from "@/components/UploadImage";
import Layout from "@/components/layouts/_layout";
import { supabase } from "@/libs/supabase";
import { useProfile } from "@/utils/hooks/profile";

import {
  ActionIcon,
  Affix,
  Anchor,
  Button,
  Container,
  Divider,
  Group,
  LoadingOverlay,
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
import { closeAllModals, modals } from "@mantine/modals";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  IconArrowNarrowLeft,
  IconChevronUp,
  IconHelpSmall,
  IconPhotoPlus,
} from "@tabler/icons-react";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RequestTag from "@/components/RequestTag";

export default function EditorPage({ tags }) {
  const [{ y }, scrollTo] = useWindowScroll();
  const theme = useMantineTheme();
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const { profile } = useProfile("id", user?.id);
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
      content: (value) =>
        value.length === 0
          ? "This field cannot be empty"
          : value.length > 2000
          ? "Maximum character exceeded"
          : null,
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    const imageRegex = /!\[.*?\]\((blob:.*?)\)/g;
    const imageLinks = [];
    let match;

    while ((match = imageRegex.exec(form.values.content))) {
      imageLinks.push(match[1]);
    }

    setImages((image) => image.filter((i) => imageLinks.includes(i.uri)));
  }, [form.values.content]);

  const handleLocalImage = async (file) => {
    const imgUrl = URL.createObjectURL(file);
    form.setFieldValue(
      "content",
      form.values.content + `![Alt text](${imgUrl}) "Image title"`
    );
    setImages((curr) => [...curr, { uri: imgUrl, file: file }]);
    closeAllModals();
  };

  const handleFormSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    if (user) {
      const uploadTasks = [];
      const imgList = images.filter((i) => values.content.includes(i.uri));
      imgList.forEach((image, index) => {
        const promise = supabase.storage
          .from("post-img")
          .upload(`${user.id}/${index}-${Date.now()}`, image.file);
        uploadTasks.push(promise);
      });
      Promise.all(uploadTasks).then((uploadedImages) => {
        let replaced = values.content;
        uploadedImages.forEach((i, idx) => {
          replaced = replaced.replace(
            imgList[idx].uri,
            "https://kirkgtkhcjuemrllhngq.supabase.co/storage/v1/object/public/post-img/" +
              i.data.path
          );
          form.setFieldValue("content", replaced);
        });
        supabase
          .from("post")
          .insert({
            title: values.title,
            content: replaced,
            profile_id: user.id,
            type: "question",
            image_url: uploadedImages.map((i) => i.data.path),
          })
          .select("id")
          .single()
          .then(
            (post) => {
              const postTags = values.postTag.map((t) => ({
                post_id: post.data.id,
                tag_id: t,
              }));
              supabase
                .from("post_tag")
                .insert(postTags)
                .then(
                  () => {
                    setLoading(false);
                    router.push(`/user/${profile.username}`);
                  },
                  (error) => {
                    setLoading(false);
                    window.alert("An error occurs when tagging...");
                  }
                );
            },
            (error) => {
              setLoading(false);
              window.alert("An error occurs when posting...");
            }
          );
      });
    } else {
      setLoading(false);
    }
  });
  return (
    <>
      <Container>
        <Button
          variant="subtle"
          radius="md"
          mb="sm"
          onClick={() => router.back()}
          leftIcon={<IconArrowNarrowLeft strokeWidth={1.5} />}
        >
          Back
        </Button>
        <Group>
          <Title>New Question Creator</Title>
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
        <form
          onSubmit={handleFormSubmit}
          className="relative flex flex-col gap-1"
        >
          <LoadingOverlay visible={loading} />
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
              Want to contribute new tag?{" "}
              <Anchor
                onClick={() =>
                  modals.open({
                    title: "Request tag",
                    children: <RequestTag tags={tags} />,
                  })
                }
              >
                Request tag
              </Anchor>
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
                onClick={() =>
                  window.open("/markdown-cheat-sheet.md", "_blank")
                }
              >
                <IconHelpSmall strokeWidth={1.5} />
              </ActionIcon>
              <Tooltip label="Upload image">
                <ActionIcon
                  variant="outline"
                  color={theme.primaryColor}
                  disabled={images.length >= 3}
                  onClick={() => {
                    modals.open({
                      title: "Upload image",
                      children: (
                        <UploadImage handleLocalImage={handleLocalImage} />
                      ),
                      modalId: "upload-post-image",
                    });
                  }}
                >
                  <IconPhotoPlus strokeWidth={1.5} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </div>
          <div className="relative">
            <Textarea
              autosize
              maxRows={20}
              minRows={5}
              placeholder="Your markdown content here"
              {...form.getInputProps("content")}
            />
          </div>
          <div className="self-end">{form.values.content.length} / 2000</div>
          <Text color="dimmed" size="sm">
            <b>Important:</b> Please do not modify image urls that are uploaded
            from your device, it may corrupt your post content.
          </Text>
          <Text color="dimmed" size="sm">
            <b>Important:</b> Remote images are free to used. However, it is not
            recommend to use many images in your post. You take your own
            responsibility for remote images.
          </Text>
          <div className="mt-2 self-end">
            <Group>
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                disabled={form.values.content.length == 0}
                variant="outline"
                color={theme.primaryColor}
                onClick={() =>
                  modals.open({
                    title: "Preview",
                    children: (
                      <MarkdownParser>{form.values.content}</MarkdownParser>
                    ),
                    size: "xl",
                  })
                }
              >
                Preview
              </Button>
              <Button type="submit" disabled={!form.isValid}>
                Post
              </Button>
            </Group>
          </div>
        </form>
      </Container>
    </>
  );
}

EditorPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getStaticProps(ctx) {
  const { data, error } = await supabase.from("tag").select("*");
  if (error) throw new Error(error.message);
  return {
    props: {
      tags: data,
      metaTitle: "New Question",
    },
    revalidate: 60,
  };
}

import MarkdownParser from "@/components/common/MarkdownParser";
import Layout from "@/components/layouts/_layout";
import UploadImage from "@/components/UploadImage";
import { useProfile } from "@/utils/hooks/profile";

import {
  ActionIcon,
  Anchor,
  Button,
  Container,
  Divider,
  Group,
  LoadingOverlay,
  MultiSelect,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals, modals } from "@mantine/modals";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  IconArrowNarrowLeft,
  IconCheck,
  IconHelpSmall,
  IconPhotoPlus,
} from "@tabler/icons-react";

import RequestTag from "@/components/RequestTag";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

export default function EditorPage({ tags, post }) {
  const theme = useMantineTheme();
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const { profile } = useProfile("id", user?.id);
  const [images, setImages] = useState([]);
  const form = useForm({
    initialValues: {
      postTag: post.post_tag.map((p) => p.tag.id),
      title: post.title,
      content: post.content,
      image_url: post.image_url || [],
    },
    validate: {
      postTag: (value) =>
        value.length === 0 ? "Select at least one tag" : null,
      content: (value) =>
        value.length === 0
          ? "This field cannot be empty"
          : value.length > 10000
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
          .update({
            title: values.title,
            content: replaced,
            profile_id: user.id,
            image_url: [
              ...values.image_url,
              uploadedImages.map((i) => i.data.path),
            ],
          })
          .eq("id", post.id)
          .select("id")
          .single()
          .then(
            (post) => {
              supabase
                .from("post_tag")
                .delete()
                .eq("post_id", post.data.id)
                .then(
                  () => {
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
                          notifications.show({
                            title: "Post updated successfully",
                            icon: <IconCheck />,
                          });
                          router.push(`/user/${profile.username}`);
                        },
                        (error) => {
                          setLoading(false);
                          notifications.show({
                            title: "An error occurs",
                            message: "Could not update post",
                            color: "red",
                            icon: <IconX />,
                          });
                        }
                      );
                  },
                  (error) => {
                    notifications.show({
                      title: "An error occurs",
                      message: "Could not update post",
                      color: "red",
                      icon: <IconX />,
                    });
                  }
                );
            },
            (error) => {
              setLoading(false);
              notifications.show({
                title: "An error occurs",
                message: "Could not update post",
                color: "red",
                icon: <IconX />,
              });
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
          <Title>Post Editor</Title>
        </Group>
        <Divider mb="md" />
        <form
          onSubmit={handleFormSubmit}
          className="relative flex flex-col gap-1"
        >
          <LoadingOverlay visible={loading} />
          <MultiSelect
            searchable
            required
            value={form.values.postTag}
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
          <div className="self-end">{form.values.content.length} / 10000</div>
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
                Save Changes
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

/**
 *
 * @param {import("next").GetServerSidePropsContext} ctx
 * @returns
 */
export async function getServerSideProps(ctx) {
  const { params, req, res } = ctx;
  const { slug } = params;
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: post, error: postErr } = await supabase
    .from("post")
    .select("*, post_tag(tag(id,name))")
    .eq("slug", slug)
    .eq("profile_id", session.user.id)
    .eq("type", "blog")
    .single();

  if (postErr || post.length == 0)
    return {
      notFound: true,
    };

  const { data, error } = await supabase.from("tag").select("*");
  if (error) throw new Error(error.message);
  return {
    props: {
      tags: data,
      post: post,
      metaTitle: "Edit Post",
    },
  };
}

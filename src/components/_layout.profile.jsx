import Layout from "@/components/_layout";
import { useProfile } from "@/utils/hooks/profile";
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Loader,
  Menu,
  Paper,
  Select,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { modals, openModal } from "@mantine/modals";
import { useUser } from "@supabase/auth-helpers-react";
import {
  IconBriefcase,
  IconCake,
  IconCameraPlus,
  IconLink,
  IconMapPin,
  IconPencil,
  IconPlus,
  IconSchool,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import EditProfileForm from "./EditProfileForm";
import MarkdownEditor from "./MarkdownEditor";

export default function ProfileLayout({ username, children }) {
  const { profile } = useProfile("username", username);
  const user = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const theme = useMantineTheme();
  const tabLinks = [
    {
      href: `/user/${username}`,
      label: "Posts",
    },
    {
      href: `/user/${username}/questions`,
      label: "Questions",
    },
    {
      href: `/user/${username}/answers`,
      label: "Answers",
    },
    {
      href: `/user/${username}/quizzes`,
      label: "Quiz Records",
    },
    {
      href: `/user/${username}/practices`,
      label: "Practice Records",
    },
  ];
  if (!profile)
    return (
      <Layout>
        <Center h={"100vh"} component={Stack}>
          <Loader />
        </Center>
      </Layout>
    );
  if (profile)
    return (
      <Layout>
        {/* Cover photo section */}
        <Paper component={Container} fluid shadow="md">
          <div className="relative mx-auto h-[25vw] max-h-[45vh] rounded-bl-lg rounded-br-lg bg-blue-400 lg:w-4/5">
            <Image
              src="/utils/gray.png"
              fill
              alt="cover"
              className="rounded-bl-lg rounded-br-lg"
            />
            {user && user?.id == profile.id && (
              <Button
                className="absolute bottom-0 right-0 mx-3 my-5 shadow"
                variant="white"
              >
                <IconCameraPlus />
                <span className="ml-1 hidden sm:block">Edit cover photo</span>
              </Button>
            )}
          </div>
          <div className="flex flex-col items-center justify-center px-5 pb-5 md:flex-row md:justify-start lg:mx-auto lg:w-4/5 lg:px-10">
            <div className="w-44">
              <Box
                className="relative -mt-[5vh] h-44 w-44 rounded-full"
                style={{
                  background:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[8]
                      : theme.colors.gray[0],
                }}
              >
                <Image
                  src={profile.avatar_url}
                  fill
                  alt="Avatar"
                  className="absolute cursor-pointer rounded-full p-[5px]"
                  onClick={() => {
                    window.open(profile.avatar_url, "_blank");
                  }}
                />
                {user && user?.id == profile.id && (
                  <ActionIcon
                    className="absolute bottom-3 right-3 rounded-full shadow"
                    variant="default"
                    size="lg"
                  >
                    <IconCameraPlus size={24} strokeWidth={1} />
                  </ActionIcon>
                )}
              </Box>
            </div>
            <div className="h-full w-full grow text-center md:pl-3 md:text-left">
              <Title order={2} my={2}>
                {profile.name}
              </Title>
              <Text color="dimmed" size="sm" weight="500">
                {profile.email}
                {profile.username != profile.id && "  •  @" + profile.username}
              </Text>
              <Text size="md" color="dimmed">
                FP: {profile.fp}
              </Text>
              {user && user?.id == profile.id && (
                <div className="mt-1 flex justify-center gap-3 md:justify-end">
                  <Menu>
                    <Menu.Target>
                      <Button leftIcon={<IconPlus strokeWidth={1.5} />}>
                        New article
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={() => {
                          modals.open({
                            title: <Text className="font-bold">New Post</Text>,
                            children: <MarkdownEditor />,
                            modalId: "newPost",
                            fullScreen: true,
                          });
                        }}
                      >
                        New post
                      </Menu.Item>
                      <Menu.Item>New question</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                  <Button
                    variant="outline"
                    leftIcon={<IconPencil strokeWidth={1.5} />}
                    onClick={() =>
                      modals.open({
                        title: <Text className="font-bold">Edit profile</Text>,
                        children: <EditProfileForm profile={profile} />,
                        modalId: "editProfile",
                        yOffset: "7vh",
                      })
                    }
                  >
                    Edit profile info
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Paper>
        <Container size="lg" my="lg">
          <div className="flex w-full flex-col gap-3 lg:flex-row lg:gap-5">
            {/* Side sections */}
            <section className="flex basis-2/5 flex-col gap-3 lg:gap-5">
              <Paper className="flex flex-col gap-2 rounded-lg border p-4 shadow">
                <Title order={3}>Intro</Title>
                {profile.introduction && (
                  <>
                    <Text size="sm" lineClamp={3}>
                      {profile.introduction}
                    </Text>
                    <Divider />
                  </>
                )}
                {profile.interest && (
                  <>
                    <Text size="sm" lineClamp={3}>
                      {profile.interest}
                    </Text>
                  </>
                )}
                {profile.birthday && (
                  <Group>
                    <IconCake strokeWidth={1.5} size="24" color="gray" />
                    <Text size="sm">
                      <Text color="dimmed">Birthday</Text>
                      {dayjs(profile.birthday).format("MMM DD, YYYY")}
                    </Text>
                  </Group>
                )}
                {profile.work &&
                  profile.work.map((item, i) => (
                    <Group key={i}>
                      <IconBriefcase strokeWidth={1.5} size="24" color="gray" />
                      <Text size="sm">
                        <Text color="dimmed">Work</Text>
                        {item}
                      </Text>
                    </Group>
                  ))}
                {profile.education &&
                  profile.education.map((item, i) => (
                    <Group key={i}>
                      <IconSchool strokeWidth={1.5} size="24" color="gray" />
                      <Text size="sm">
                        <Text color="dimmed">Education</Text>
                        {item}
                      </Text>
                    </Group>
                  ))}
                {profile.country && (
                  <Group>
                    <IconMapPin strokeWidth={1.5} size="24" color="gray" />
                    <Text size="sm">
                      <Text color="dimmed">From</Text>
                      {profile.country}
                    </Text>
                  </Group>
                )}
                {profile.link &&
                  profile.link.map((item, i) => (
                    <Group key={i}>
                      <IconLink strokeWidth={1.5} size="24" color="gray" />
                      <Text size="sm">
                        <Text color="dimmed">Link</Text>
                        <Anchor href={`//${item}`} target="_blank">
                          {item}
                        </Anchor>
                      </Text>
                    </Group>
                  ))}
              </Paper>
              <Paper className="flex h-96 flex-col gap-2 rounded-lg border p-4 shadow">
                <Title order={3}>Achievements</Title>
              </Paper>
              <Paper className="flex h-96 flex-col gap-2 rounded-lg border p-4 shadow">
                <Title order={3}>Interest tags</Title>
              </Paper>
            </section>
            {/* Main section */}
            <section className="basis-3/5">
              <div className="mb-3 flex items-center justify-end gap-2">
                <Select
                  variant="unstyled"
                  inputContainer={(children) => (
                    <Paper pl="sm" shadow="lg">
                      {children}
                    </Paper>
                  )}
                  aria-label="Filter"
                  data={tabLinks.map((link) => ({
                    label: link.label,
                    value: link.href,
                  }))}
                  value={pathname}
                  onChange={(value) => router.push(value)}
                />
              </div>
              <Paper shadow="lg" px="md" py="sm">
                {children}
              </Paper>
            </section>
          </div>
        </Container>
      </Layout>
    );
}

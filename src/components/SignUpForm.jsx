import {
  Button,
  Divider,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function SignUpForm() {
  const theme = useMantineTheme();
  const supabase = useSupabaseClient();
  const [opened, { open, close }] = useDisclosure(false);
  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) open();
  };
  const ErrorModal = () => {
    return (
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text color={"red"} className="font-medium">
            Authentication Error
          </Text>
        }
      >
        <Text size="sm" color={"dimmed"}>
          Could not sign in with your Google account. Please try again.
        </Text>
      </Modal>
    );
  };
  return (
    <>
      <ErrorModal />
      <Stack spacing="sm">
        <Title order={2} className=" mx-auto" color={theme.primaryColor}>
          Get started
        </Title>
        <Button
          variant="light"
          my="lg"
          size="md"
          className="shadow"
          leftIcon={
            <Image
              src={"/brands/google.svg"}
              alt="google"
              width={24}
              height={24}
            />
          }
          onClick={handleGoogleSignIn}
        >
          Sign Up With Google
        </Button>
        <Divider
          color={
            theme.colorScheme == "dark"
              ? theme.colors.dark[2]
              : theme.colors.gray[2]
          }
        />
        <Text
          component={Link}
          href="/auth/signin"
          className="text-center font-medium"
          py={"xs"}
          size="sm"
        >
          Already have an account?
        </Text>
      </Stack>
    </>
  );
}

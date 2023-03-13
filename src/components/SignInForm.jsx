import {
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { IconLockExclamation } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function SignInForm() {
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
          Hi, Welcome Back
        </Title>
        <Text color="dimmed" className="mx-auto">
          Enter your credential to continue
        </Text>
        <Button
          variant="light"
          my="lg"
          size="md"
          className="shadow"
          leftIcon={
            <Image src={"/google.svg"} alt="google" width={24} height={24} />
          }
          onClick={handleGoogleSignIn}
        >
          Sign In With Google
        </Button>
        <Divider
          color={
            theme.colorScheme == "dark"
              ? theme.colors.dark[2]
              : theme.colors.gray[2]
          }
          label={
            <Paper withBorder>
              <Text className="px-10 py-2" color="dimmed">
                OR
              </Text>
            </Paper>
          }
          labelPosition="center"
        />
        <Text className="mx-auto" my="lg" color="dimmed">
          Sign in with Email address
        </Text>
        <TextInput
          placeholder="your@email.com"
          size={"md"}
          label={<Text size={"sm"}>Email Address</Text>}
        />
        <Text
          component={Link}
          href="#"
          className="self-end font-medium"
          color={theme.primaryColor}
          size="sm"
        >
          Forgot password?
        </Text>
        <Button size={"md"} mt="lg">
          <Text>Sign In</Text>
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
          href="/auth/signup"
          className="text-center font-medium"
          py={"xs"}
          size="sm"
        >
          Don&#39;t have an account?
        </Text>
      </Stack>
    </>
  );
}

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
import { isEmail, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { IconLockExclamation } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignInForm() {
  const theme = useMantineTheme();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: isEmail("Invalid email format"),
    },
  });
  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // redirectTo: "https://forwarding.vercel.app",
      },
    });
    if (error) open();
  };
  const handleEmailSignin = form.onSubmit(async (values) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        shouldCreateUser: false,
      },
    });
    if (error) {
      if (error.message == "Signups not allowed for otp") {
        form.setFieldError("email", "Could not find your email address");
      } else {
        form.setFieldError("email", "Unable to signin with your email");
      }
      return setLoading(false);
    }
    if (data) {
      modals.open({
        title: "Check your email",
        children: (
          <>
            <Text size="sm">
              An email has been sent to your email address. Please check either
              inbox and spam emails. The email will expire in 24 hours.
            </Text>
            <Text color="dimmed" size="sm" mt="sm">
              You can safely close this tab.
            </Text>
          </>
        ),
      });
    }
    return setLoading(false);
  });
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
            <Image
              src={"/brands/google.svg"}
              alt="google"
              width={24}
              height={24}
            />
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
        <form onSubmit={handleEmailSignin}>
          <TextInput
            type="email"
            placeholder="your@email.com"
            size={"md"}
            required
            withAsterisk={false}
            label={<Text size={"sm"}>Email Address</Text>}
            {...form.getInputProps("email")}
          />
          <Stack>
            {/* <Text
              component={Link}
              href="#"
              className="self-end font-medium"
              color={theme.primaryColor}
              size="sm"
            >
              Forgot password?
            </Text> */}
            <Button size={"md"} mt="lg" type="submit" loading={loading}>
              <Text>Sign In</Text>
            </Button>
          </Stack>
        </form>
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

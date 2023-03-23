import {
  Button,
  Divider,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function SignUpForm() {
  const theme = useMantineTheme();
  return (
    <Stack spacing="sm">
      <Title order={2} className=" mx-auto" color={theme.primaryColor}>
        Get started
      </Title>
      {/* <Text color="dimmed" className="mx-auto">
        Enter your credential to continue
      </Text> */}
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
  );
}

import { Anchor, Group, Stack, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function AppLogo() {
  const router = useRouter();
  return (
    <Group spacing={0}>
      <Anchor className="flex items-center" component={Link} href="/">
        <Image
          src="/logo.svg"
          width={24}
          height={24}
          alt="Forwarding Logo"
          className="my-0"
        />
        <Text
          size="14px"
          ml="sm"
          fw={"900"}
          variant="gradient"
          gradient={{ from: "purple", to: "indigo", deg: 45 }}
          // style={{backgroundImage: "linear-gradient(to right, #4338ca,#a21caf)"}}
          className={` font-black`}
        >
          FORWARDING
        </Text>
      </Anchor>
      {router.pathname.startsWith("/manager") && (
        <Text
          size={"xs"}
          ml="xs"
          fw={800}
          variant={"gradient"}
          gradient={{ from: "purple", to: "indigo", deg: 45 }}
        >
          Admin
        </Text>
      )}
    </Group>
  );
}

import { Anchor, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Montserrat } from "next/font/google";
import styles from "@/styles/logo.module.css";

const font = Montserrat({ subsets: ["latin"] });

export default function AppLogo() {
  return (
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
        className={`${font.className} ${styles.logo} hover:animate-move hover:bg-clip-text hover:text-transparent`}
      >
        FORWARDING
      </Text>
    </Anchor>
  );
}

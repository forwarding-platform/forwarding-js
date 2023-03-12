import { Anchor, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Montserrat } from "next/font/google";
import styles from "../styles/logo.module.css";

const font = Montserrat({ subsets: ["latin"] });

export default function AppLogo() {
  return (
    <Anchor
      className="mr-4 flex items-center"
      component={Link}
      href="/"
      underline={false}
    >
      <Image
        src="/logo.svg"
        width={24}
        height={24}
        alt="Forwarding Logo"
        className="my-0"
      />
      <Text
        size="16px"
        ml="sm"
        fw={"900"}
        variant="gradient"
        gradient={{ from: "purple", to: "indigo", deg: 45 }}
        className={`${font.className} ${styles.logo}`}
        // style={{ fontFamily: font.style.fontFamily }}
      >
        FORWARDING
      </Text>
    </Anchor>
  );
}

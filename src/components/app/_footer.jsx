import { footerLinks } from "@/constants/footerLinks";
import { Anchor, Container, Stack, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ToggleScheme from "./ToggleScheme";
import AppLogo from "./_logo";

export default function AppFooter() {
  const linkGroup = footerLinks.map((group) => {
    const links = group.links.map((link, index) => (
      <Anchor
        component={Link}
        key={index}
        href={link.href}
        onClick={(e) => e.preventDefault()}
        className="block py-[3px] text-sm hover:underline"
        color="dimmed"
      >
        {link.label}
      </Anchor>
    ));
    return (
      <div key={group.groupName} className="w-[160px]">
        <Text className=" mb-2 font-medium">{group.groupName}</Text>
        {links}
      </div>
    );
  });
  return (
    <Container className="flex flex-col items-center justify-center py-2 md:flex-row md:justify-between">
      <div className="hidden md:block">
        <div className="flex w-full items-center justify-center md:justify-start">
          <AppLogo />
        </div>
        <Text
          size="xs"
          color="dimmed"
          className="mt-3 hidden max-w-[200px] text-center md:mt-7 md:block md:text-left"
        >
          Learning, sharing, and practicing made easy with Forwarding Platform
        </Text>
      </div>
      <div className="mb-2 hidden flex-wrap md:flex">{linkGroup}</div>
      <div className="my-2 flex flex-wrap justify-center text-sm md:hidden">
        <div className="mb-4 flex w-full items-center justify-center md:justify-start">
          <AppLogo />
        </div>
        {footerLinks.map((item) =>
          item.links.map((link, index) => (
            <Anchor
              component={Link}
              key={index}
              href={link.href}
              onClick={(e) => e.preventDefault()}
              color="dimmed"
              className="mx-3"
            >
              {link.label}
            </Anchor>
          ))
        )}
      </div>
    </Container>
  );
}

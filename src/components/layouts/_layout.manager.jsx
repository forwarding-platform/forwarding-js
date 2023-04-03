import { Box, Container, NavLink } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function ManagerLayout({ children }) {
  const router = useRouter();
  return (
    <div className="flex gap-2">
      <section className=" w-72 flex-none">
        {links.map((link, index) => (
          <NavLink
            key={index}
            label={link.label}
            component={Link}
            href={link.href}
            variant="light"
            pl={"md"}
            className="cursor-pointer rounded underline-offset-4 hover:underline"
            active={router.pathname == link.href}
          />
        ))}
      </section>
      <Box className="w-full overflow-clip px-5">{children}</Box>
    </div>
  );
}

const links = [
  {
    href: "/manager",
    label: "Dashboard",
  },
  {
    href: "/manager/practice",
    label: "Practice Group",
  },
  {
    href: "/manager/practice-challenge",
    label: "Practice Challenges",
  },
  {
    href: "/manager/requested-tag",
    label: "Tags",
  },
  {
    href: "/manager/quiz",
    label: "Quiz Group",
  },
  {
    href: "/manager/quiz-qa",
    label: "Quizzes",
  },
];

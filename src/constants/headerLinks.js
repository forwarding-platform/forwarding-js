import {
  IconBrandCodesandbox,
  IconCode,
  IconHelpCircle,
  IconLogout,
  IconSettings2,
  IconTicTac,
} from "@tabler/icons-react";

/**
 * @type {[{href: string, label: string}]}
 */
export const headerLinks = [
  {
    href: "/explore",
    label: "Explore",
  },
  {
    href: "/post",
    label: "Post",
  },
  {
    href: "/qna",
    label: "Q & A",
  },
  {
    href: "/practice",
    label: "Practice",
  },
];

/**
 * @type {[{icon: import("@tabler/icons-react").Icon, title: import("react").ReactNode, description: import("react").ReactNode, href: string}]}
 */
export const appSubLinks = [
  {
    icon: IconCode,
    title: "Code Runner",
    description: "Compile and execute codes without leaving your browser",
    href: "/code",
  },
  {
    icon: IconTicTac,
    title: "Quizzes",
    description: "Prepare your programming knowledge by quizzes",
    href: "/quiz",
  },
  {
    icon: IconBrandCodesandbox,
    title: "Node.js Sandbox",
    description: "In-browser Node.js playground powered by Codesandbox",
    href: "/sandbox",
  },
  {
    icon: IconHelpCircle,
    title: "Guide",
    description: "Learn how to use Apps",
    href: "/guide",
  },
];

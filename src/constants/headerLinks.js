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
    href: "/blog",
    label: "Blog",
  },
  {
    href: "/discuss",
    label: "Discuss",
  },
  {
    href: "/practice",
    label: "Practice",
  },
];

/**
 * @type {[{icon: import("@tabler/icons-react").Icon, title: import("react").ReactNode, description: import("react").ReactNode}]}
 */
export const appSubLinks = [
  {
    icon: IconCode,
    title: "Code Runner",
    description: "Compile and execute codes without leaving your browser",
  },
  {
    icon: IconTicTac,
    title: "Quizzes",
    description: "Prepare your programming knowledge by quizzes",
  },
  {
    icon: IconBrandCodesandbox,
    title: "Node.js Sandbox",
    description: "In-browser Node.js playground powered by Codesandbox",
  },
  {
    icon: IconHelpCircle,
    title: "Guide",
    description: "Learn how to use Apps",
  },
];

import { Montserrat } from "next/font/google";

const font = Montserrat({ subsets: ["latin", "vietnamese"] });

/**
 * @type {import("@mantine/core").MantineTheme}
 */
export const theme = {
  primaryColor: "violet",
  primaryShade: 8,
  fontFamily: font.style.fontFamily,
  components: {
    Modal: {
      styles: () => ({
        header: {
          zIndex: 1,
        },
      }),
    },
  },
  colors: {
    gray: [
      "#F8FAFC",
      "#F1F5F9",
      "#E2E8F0",
      "#CBD5E1",
      "#94A3B8",
      "#64748B",
      "#475569",
      "#334155",
      "#1E293B",
      "#0F172A",
    ],
  },
  loader: "dots",
};

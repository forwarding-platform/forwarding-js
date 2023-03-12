import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

/**
 * @type {import("@mantine/core").MantineTheme}
 */
export const theme = {
  primaryColor: "violet",
  primaryShade: 8,
  fontFamily: font.style.fontFamily,
  colors: {
    dark: [
      "#C2C3CA",
      "#868997",
      "#606578",
      "#444A5F",
      "#2F354D",
      "#1E253F",
      "#111936",
      "#101321",
      "#0C0E14",
      "#090A0D",
    ],
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
};

import { theme } from "@/utils/theme";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import React from "react";

export default function Providers({ children }) {
  // Handle color scheme of the application
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "app-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (scheme) => {
    const nextColorScheme = scheme || scheme == "dark" ? "light" : "dark";
    setColorScheme(nextColorScheme);
  };

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          ...theme,
          colorScheme,
        }}
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

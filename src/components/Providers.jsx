import { theme } from "@/utils/theme";
import {
  ColorSchemeProvider,
  MantineProvider,
  Notification,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import React, { useState } from "react";

export default function Providers({ children, pageProps }) {
  // Handle color scheme of the application
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (scheme) => {
    const nextColorScheme = scheme || colorScheme == "dark" ? "light" : "dark";
    setColorScheme(nextColorScheme);
  };

  // Handle supabase instance
  const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps?.initialSession}
    >
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            ...theme,
            colorScheme: colorScheme,
          }}
        >
          <ModalsProvider>
            <Notification />
            {children}
          </ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </SessionContextProvider>
  );
}

import { AppShell, Box, useMantineTheme } from "@mantine/core";
import React from "react";
import AppFooter from "./_footer";
import { AppHeader } from "./_header";

export default function Layout({ children }) {
  const theme = useMantineTheme();
  return (
    <>
      <AppShell
        header={<AppHeader />}
        styles={{
          main: {
            backgroundColor:
              theme.colorScheme == "dark" ? theme.colors.dark[7] : theme.white,
          },
        }}
        padding={0}
      >
        <Box className="h-full min-h-screen">{children}</Box>
        <AppFooter />
      </AppShell>
    </>
  );
}

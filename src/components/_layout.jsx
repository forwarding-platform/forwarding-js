import { Box, useMantineTheme } from "@mantine/core";
import React from "react";
import AppFooter from "./_footer";
import { AppHeader } from "./_header";

export default function Layout({ children }) {
  const theme = useMantineTheme();
  return (
    <>
      <AppHeader />
      <Box
        className="h-full min-h-screen"
        style={{
          backgroundColor:
            theme.colorScheme == "dark" ? theme.colors.dark[7] : theme.white,
        }}
      >
        {children}
      </Box>
      <AppFooter />
    </>
  );
}

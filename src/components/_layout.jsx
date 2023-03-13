import { Box } from "@mantine/core";
import React from "react";
import AppFooter from "./_footer";
import { AppHeader } from "./_header";

export default function Layout({ children }) {
  return (
    <>
      <AppHeader />
      <Box className="h-full min-h-screen">{children}</Box>
      <AppFooter />
    </>
  );
}

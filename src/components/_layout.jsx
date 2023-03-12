import React from "react";
import { AppHeader } from "./_header";

export default function Layout({ children }) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}

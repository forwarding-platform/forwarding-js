import { AppShell, Box, useMantineTheme } from "@mantine/core";
import { useSession } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { useEffect } from "react";
import ToggleScheme from "../app/ToggleScheme";
import AppFooter from "../app/_footer";
import { AppHeader } from "../app/_header";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const theme = useMantineTheme();
  const router = useRouter();
  return (
    <>
      <Head>
        <title>
          {children.props?.metaTitle
            ? children.props.metaTitle + " | Forwarding"
            : "Forwarding"}
        </title>
      </Head>
      <AppShell
        header={<AppHeader />}
        styles={
          router.pathname !== "/" && {
            main: {
              backgroundColor:
                theme.colorScheme == "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          }
        }
        padding={0}
      >
        <Box
          className={`${
            theme.colorScheme == "dark"
              ? "background-gradient-dark"
              : "background-gradient-light"
          }  h-full min-h-[50vh]`}
        >
          {children}
        </Box>
        <div className="fixed bottom-0 left-0 m-1">
          <ToggleScheme />
        </div>
        <AppFooter />
      </AppShell>
    </>
  );
}

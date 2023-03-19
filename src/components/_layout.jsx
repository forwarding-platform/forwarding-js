import { AppShell, Box, useMantineTheme } from "@mantine/core";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import ToggleScheme from "./ToggleScheme";
import AppFooter from "./_footer";
import { AppHeader } from "./_header";

export default function Layout({ children }) {
  const theme = useMantineTheme();
  const session = useSession();
  useEffect(() => {
    if (session) {
      console.log("exp", session.expires_at);
      console.log("expIn", session.expires_in);
    }
  }, [session]);
  return (
    <>
      <AppShell
        header={<AppHeader />}
        styles={{
          main: {
            backgroundColor:
              theme.colorScheme == "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        }}
        padding={0}
      >
        <Box className="h-full min-h-screen">{children}</Box>
        <div className="fixed bottom-0 right-0 m-1">
          <ToggleScheme />
        </div>
        <AppFooter />
      </AppShell>
    </>
  );
}

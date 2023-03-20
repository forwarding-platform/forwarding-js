import ToggleScheme from "@/components/app/ToggleScheme";
import Layout from "@/components/layouts/_layout";
import { useProfile } from "@/utils/hooks/profile";
import { Container } from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";

export default function Index() {
  const user = useUser();
  return (
    <Layout>
      <Container>
        User: {user?.email} <br />
      </Container>
    </Layout>
  );
}

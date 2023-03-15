import ToggleScheme from "@/components/ToggleScheme";
import Layout from "@/components/_layout";
import { useProfile } from "@/utils/hooks/profile";
import { Container } from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";

export default function Index() {
  const user = useUser();
  const { profile, isLoading, error } = useProfile("id", user?.id);
  if (error) return JSON.stringify(error, null, 2);
  if (isLoading) return "Loading ...";
  return (
    <Layout>
      <Container>
        User: {user?.email} <br />
        Name: {profile?.name}
      </Container>
    </Layout>
  );
}

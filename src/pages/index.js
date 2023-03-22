import ToggleScheme from "@/components/app/ToggleScheme";
import Layout from "@/components/layouts/_layout";
import { useProfile } from "@/utils/hooks/profile";
import { Container } from "@mantine/core";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";

export default function Index({ post }) {
  return (
    <Layout>
      <Container></Container>
    </Layout>
  );
}

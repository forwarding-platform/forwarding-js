import Layout from "@/components/layouts/_layout";
import { supabaseAdmin } from "@/libs/adminSupabase";
import { Button, Container } from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Index({ managerList }) {
  const user = useUser();
  const isManager = user && managerList.includes(user.id);
  const router = useRouter();
  return (
    <>
      <Container>
        {isManager && (
          <Button component={Link} target="_blank" href={"/manager"}>
            Admin Panel
          </Button>
        )}
      </Container>
    </>
  );
}

Index.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps(ctx) {
  const { data, error } = await supabaseAdmin.from("manager").select("id");
  return {
    props: {
      metaTitle: "Home",
      managerList: data?.map((d) => d.id) || [],
    },
  };
}

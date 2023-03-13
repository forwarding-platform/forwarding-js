import Layout from "@/components/_layout";
import { supabase } from "@/libs/supabase";
import { useProfile } from "@/utils/hooks/profile";
import { Center, Loader, Stack } from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function ProfilePage(props) {
  const [profile, setProfile] = useState();
  const { profile: updatedProfile } = useProfile("username", profile?.username);
  const user = useUser();
  const router = useRouter();
  useEffect(() => {
    if (updatedProfile) {
      console.log("Updating new info...");
      setProfile(updatedProfile);
    }
  }, [updatedProfile]);
  useEffect(() => {
    setProfile(props.profile);
  }, [props.profile]);
  if (router.isFallback)
    return (
      <Center h={"100vh"} component={Stack}>
        <Loader />
      </Center>
    );
  return (
    <Layout>
      <pre> {profile && JSON.stringify(profile, null, 2)}</pre>
    </Layout>
  );
}

export async function getStaticPaths() {
  const { data: path } = await supabase.from("profile").select("username");
  const paths = path.map((p) => ({ params: { username: p.toString() } }));
  return { paths, fallback: true };
}

export async function getStaticProps(ctx) {
  const { params } = ctx;
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("username", params.username)
    .single();

  if (error)
    return {
      notFound: true,
    };

  return {
    props: {
      profile: data,
    },
  };
}

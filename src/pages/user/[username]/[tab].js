import ProfileLayout from "@/components/layouts/_layout.profile";
import { supabase } from "@/libs/supabase";
import React from "react";

export default function ProfileTabPage({ tabData, username }) {
  return (
    <ProfileLayout username={username}>
      TabPage: {tabData}, of {username}
    </ProfileLayout>
  );
}

export async function getStaticPaths() {
  const { data: usernames } = await supabase.from("profile").select("username");
  const tabs = ["questions", "answers"];
  const paths = usernames.flatMap((u) => {
    return tabs.map((tab) => ({
      params: { username: u.username, tab },
    }));
  });
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(ctx) {
  const { params } = ctx;
  return {
    props: {
      tabData: params.tab,
      username: params.username,
    },
  };
}

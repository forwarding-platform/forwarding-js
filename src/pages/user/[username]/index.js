import Layout from "@/components/_layout";
import ProfileLayout from "@/components/_layout.profile";
import { supabase } from "@/libs/supabase";
import { useProfile } from "@/utils/hooks/profile";
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";
import {
  IconBriefcase,
  IconCake,
  IconCameraPlus,
  IconLink,
  IconMapPin,
  IconPencil,
  IconPlus,
  IconSchool,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ProfileTabPage from "./[tab]";

export default function ProfilePage({ username, posts }) {
  const router = useRouter();
  if (router.isFallback)
    return (
      <Layout>
        <Center h={"100vh"} component={Stack}>
          <Loader />
        </Center>
      </Layout>
    );
  return (
    <ProfileLayout username={username}>
      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </ProfileLayout>
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
    .select("post(*)")
    .eq("username", params.username)
    .eq("post.type", "blog")
    .single();

  if (error)
    return {
      notFound: true,
    };

  return {
    props: {
      posts: data.post,
      username: params.username,
    },
  };
}

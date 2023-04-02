import Layout from "@/components/layouts/_layout";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";

export default function ExplorePage() {
  return <h1>Explore</h1>;
}

ExplorePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getStaticProps(ctx) {
  return {
    props: {
      metaTitle: "Explore",
    },
  };
}

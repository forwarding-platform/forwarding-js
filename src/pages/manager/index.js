import Layout from "@/components/layouts/_layout";
import ManagerLayout from "@/components/layouts/_layout.manager";
import { Button } from "@mantine/core";
import React from "react";

export default function Index() {
  return (
    <ManagerLayout>
      <Button>ddffd gfdgfd g gdf gfd gfd g dfg fdg df g </Button>
    </ManagerLayout>
  );
}

Index.getLayout = (page) => <Layout>{page}</Layout>;
export async function getServerSideProps(ctx) {
  return {
    props: {
      metaTitle: "Admin Panel",
    },
  };
}

import SignUpForm from "@/components/SignUpForm";
import AuthLayout from "@/components/layouts/_layout.auth";
import React from "react";
import Head from "next/head";

export default function SignUpPage() {
  return <SignUpForm />;
}

SignUpPage.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export async function getStaticProps(ctx) {
  return {
    props: {
      metaTitle: "Forwarding - Sign Up",
    },
  };
}

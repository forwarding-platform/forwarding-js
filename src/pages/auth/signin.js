import SignInForm from "@/components/SignInForm";
import AuthLayout from "@/components/layouts/_layout.auth";
import React from "react";

export default function SignInPage() {
  return <SignInForm />;
}

SignInPage.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export async function getStaticProps(ctx) {
  return {
    props: {
      metaTitle: "Forwarding - Sign In",
    },
  };
}

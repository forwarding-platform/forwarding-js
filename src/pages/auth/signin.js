import SignInForm from "@/components/SignInForm";
import AuthLayout from "@/components/layouts/_layout.auth";
import React from "react";

export default function signin() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}

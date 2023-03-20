import SignUpForm from "@/components/SignUpForm";
import AuthLayout from "@/components/layouts/_layout.auth";
import React from "react";

export default function signup() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}

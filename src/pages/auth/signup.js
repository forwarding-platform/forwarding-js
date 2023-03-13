import SignUpForm from "@/components/SignUpForm";
import AuthLayout from "@/components/_layout.auth";
import React from "react";

export default function signup() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}

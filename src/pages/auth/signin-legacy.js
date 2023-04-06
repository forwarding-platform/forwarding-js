import SignInPasswordForm from "@/components/PasswordSignInForm";
import AuthLayout from "@/components/layouts/_layout.auth";

export default function SignInPage() {
  return <SignInPasswordForm />;
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

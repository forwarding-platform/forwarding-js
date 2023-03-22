import { Button, Text } from "@mantine/core";
import { useRouter } from "next/router";

export default function RequireAuth({ context, id, innerProps }) {
  const router = useRouter();
  return (
    <>
      <Text size="sm">You need to sign in to use this feature.</Text>
      <div>{innerProps?.modalBody}</div>
      <Button
        fullWidth
        mt={"md"}
        onClick={() => {
          router.push("/auth/signin");
          context.closeModal(id);
        }}
      >
        Sign in
      </Button>
    </>
  );
}

import { Box, Button, Group, TextInput, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { IconCheck, IconX } from "@tabler/icons-react";
import React from "react";

export default function RequestTag({ tags }) {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      tag: (value) =>
        tags?.map((t) => t.name).includes(value) ? "Tag is available" : null,
    },
  });
  const handleSubmit = form.onSubmit(async (values) => {
    const { data, error } = await supabase
      .from("requested_tag")
      .insert({ name: values.name.toLowerCase() });
    if (error) {
      console.log(error);
      notifications.show({
        title: "An error occurs",
        message: `Could not perform your action`,
        icon: <IconX />,
        color: "red",
      });
      modals.closeAll();
    } else {
      notifications.show({
        title: "Tag requested successfully",
        message: "Your tag will be reviewed and available soon",
        icon: <IconCheck />,
      });
      modals.closeAll();
    }
  });
  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Tag"
        required
        placeholder="Enter tag"
        {...form.getInputProps("name")}
      />
      <Group mt="sm" position="right">
        <Button variant="light" onClick={() => modals.closeAll()}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

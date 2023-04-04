import Layout from "@/components/layouts/_layout";
import ManagerLayout from "@/components/layouts/_layout.manager";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  FileButton,
  FileInput,
  Group,
  NumberInput,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { IconCheck, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { MantineReactTable } from "mantine-react-table";
import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useSWR from "swr";

export default function BadgeManage() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const theme = useMantineTheme();
  const { data, isLoading, error, mutate } = useSWR(
    user ? "badge" : null,
    async () => {
      const { data, error } = await supabase
        .from("achievement")
        .select("*")
        .order("fp_required");
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      if (data) return data;
    }
  );
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "fp_required",
        header: "FP required",
      },
      {
        accessorKey: "image_url",
        header: "Image",
        Cell: ({ cell }) => (
          <Image
            width={100}
            height={100}
            src={`https://kirkgtkhcjuemrllhngq.supabase.co/storage/v1/object/public/badges/${cell.getValue(
              "image_url"
            )}`}
            alt=""
          />
        ),
      },
    ],
    []
  );

  const handleCreateNew = () => {
    modals.open({
      title: "Create new achievement",
      children: <HandleCreate mutate={mutate} />,
    });
  };
  const handleUpdateRow = (row) => {
    modals.open({
      title: "Update achievement",
      children: <HandleUpdate row={row} mutate={mutate} />,
    });
  };
  const handleDeleteRow = (row) => {
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          Are you sure to delete <b>{row.getValue("name")}</b>?
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => modals.closeAll(),
      onConfirm: async () => {
        const { error: delErr } = await supabase.storage
          .from("badges")
          .remove([row.original.image_url]);
        if (!delErr) {
          const { error, data } = await supabase
            .from("achievement")
            .delete()
            .eq("id", row.original.id)
            .select("id")
            .single();
          if (data) {
            notifications.show({
              title: "Achievement deleted successfully",
              icon: <IconCheck />,
            });
            modals.closeAll();
            mutate();
          }
          if (error) {
            notifications.show({
              title: "Could not delete achievement",
              icon: <IconX />,
              color: "red",
            });
          }
        } else {
          notifications.show({
            title: "Could not delete badge",
            icon: <IconX />,
            color: "red",
          });
        }
      },
    });
  };
  return (
    <ManagerLayout>
      <Title my="md">Achievement Management</Title>
      <MantineReactTable
        data={data || []}
        columns={columns}
        enableDensityToggle={false}
        positionActionsColumn="first"
        enableColumnOrdering
        enableEditing
        mantineToolbarAlertBannerProps={
          error
            ? {
                color: "error",
                children: "Error loading data",
              }
            : undefined
        }
        state={{
          isLoading: isLoading,
          showAlertBanner: error,
        }}
        renderTopToolbarCustomActions={() => (
          <Button
            color={theme.fn.primaryColor()}
            onClick={handleCreateNew}
            variant="filled"
          >
            + New Achievement
          </Button>
        )}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "16px" }}>
            <Tooltip withArrow position="left" label="Edit">
              <ActionIcon onClick={() => handleUpdateRow(row)}>
                <IconEdit />
              </ActionIcon>
            </Tooltip>
            <Tooltip withArrow position="right" label="Delete">
              <ActionIcon color="red" onClick={() => handleDeleteRow(row)}>
                <IconTrash />
              </ActionIcon>
            </Tooltip>
          </Box>
        )}
      />
    </ManagerLayout>
  );
}

BadgeManage.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps(ctx) {
  return {
    props: {
      metaTitle: "Achievement Management",
    },
  };
}

function HandleCreate({ mutate }) {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const [image, setImage] = useState();
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      image_url: "",
      fp_required: 0,
    },
    validate: {
      image_url: (value) => (value ? null : "Upload image"),
      fp_required: (value) => (value < 0 ? "Invalid point" : null),
    },
  });
  useEffect(() => {
    if (image) {
      form.setFieldValue("image_url", image.name);
    } else {
      form.setFieldValue("image_url", "");
    }
  }, [image]);
  const handleSubmit = form.onSubmit(async (values) => {
    const { data: uri, error } = await supabase.storage
      .from("badges")
      .upload(`${Date.now()}`, image);
    if (error) {
      console.log(error);
      notifications.show({
        title: "An error occurs",
        message: "Could not add achievement",
        icon: <IconX />,
        color: "red",
      });
      modals.closeAll();
    }
    if (uri.path) {
      const { data, error } = await supabase
        .from("achievement")
        .insert({ ...values, image_url: uri.path })
        .select("id");
      if (error) {
        console.log(error);
        notifications.show({
          title: "An error occurs",
          message: "Could not add this achievement",
          icon: <IconX />,
          color: "red",
        });
        modals.closeAll();
      }
      if (data) {
        notifications.show({
          title: "Achievement added successfully",
          icon: <IconCheck />,
          color: theme.fn.primaryColor(),
        });
        mutate();
        modals.closeAll();
      }
    }
  });
  return (
    <form onSubmit={handleSubmit}>
      <TextInput label="Name" required {...form.getInputProps("name")} />
      <Textarea
        label="Description"
        minRows={2}
        maxRows={5}
        autosize
        {...form.getInputProps("description")}
      />
      <NumberInput
        label="FP required"
        min={1}
        required
        {...form.getInputProps("fp_required")}
      />
      <FileInput
        label="Upload image"
        placeholder="Upload image"
        required
        onChange={setImage}
        error={form.getInputProps("image_url").error}
      />
      <Center mt="sm">
        {image && (
          <Image
            width={100}
            height={100}
            src={URL.createObjectURL(image)}
            alt=""
          />
        )}
      </Center>
      <Group position="right" mt="sm">
        <Button variant="light" onClick={() => modals.closeAll()}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

function HandleUpdate({ mutate, row }) {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const [image, setImage] = useState();
  const form = useForm({
    initialValues: {
      name: row.original.name,
      description: row.original.description || "",
      image_url: row.original.image_url,
      fp_required: row.original.fp_required,
    },
    validate: {
      fp_required: (value) => (value < 0 ? "Invalid FP" : null),
    },
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    if (image) {
      const { error: delErr } = await supabase.storage
        .from("badges")
        .remove([row.original.image_url]);
      if (!delErr) {
        const { data: uri, error: upErr } = await supabase.storage
          .from("badges")
          .upload(Date.now().toString(), image);
        if (upErr) {
          console.log(upErr);
          notifications.show({
            title: "An error occurs",
            message: "Could not update this achievement",
            icon: <IconX />,
            color: "red",
          });
          modals.closeAll();
        }
        if (uri.path) {
          const { data, error } = await supabase
            .from("achievement")
            .update({ ...values, image_url: uri.path })
            .eq("id", row.original.id)
            .select("id");
          if (error) {
            console.log(error);
            notifications.show({
              title: "An error occurs",
              message: "Could not update this achievement",
              icon: <IconX />,
              color: "red",
            });
            modals.closeAll();
          }
          if (data) {
            notifications.show({
              title: "Achievement updated successfully",
              icon: <IconCheck />,
              color: theme.fn.primaryColor(),
            });
            mutate();
            modals.closeAll();
          }
        }
      } else {
        console.log(delErr);
        notifications.show({
          title: "An error occurs",
          message: "Could not update this achievement",
          icon: <IconX />,
          color: "red",
        });
        modals.closeAll();
      }
    } else {
      const { data, error } = await supabase
        .from("achievement")
        .update({ ...values })
        .eq("id", row.original.id)
        .select("id");
      if (error) {
        console.log(error);
        notifications.show({
          title: "An error occurs",
          message: "Could not update this achievement",
          icon: <IconX />,
          color: "red",
        });
        modals.closeAll();
      }
      if (data) {
        notifications.show({
          title: "Achievement updated successfully",
          icon: <IconCheck />,
          color: theme.fn.primaryColor(),
        });
        mutate();
        modals.closeAll();
      }
    }
  });
  return (
    <form onSubmit={handleSubmit}>
      <TextInput label="Name" required {...form.getInputProps("name")} />
      <Textarea
        label="Description"
        minRows={2}
        maxRows={5}
        autosize
        required
        {...form.getInputProps("description")}
      />
      <NumberInput
        min={1}
        label="FP required"
        required
        {...form.getInputProps("fp_required")}
      />
      <FileInput
        label="Upload image"
        placeholder="Upload image"
        onChange={setImage}
      />
      <Center mt="sm">
        {image ? (
          <Image
            width={100}
            height={100}
            src={URL.createObjectURL(image)}
            alt=""
          />
        ) : (
          <Image
            width={100}
            height={100}
            src={`https://kirkgtkhcjuemrllhngq.supabase.co/storage/v1/object/public/badges/${form.values.image_url}`}
            alt=""
          />
        )}
      </Center>
      <Group position="right" mt="sm">
        <Button variant="light" onClick={() => modals.closeAll()}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Submit
        </Button>
      </Group>
    </form>
  );
}

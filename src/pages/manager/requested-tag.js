import Layout from "@/components/layouts/_layout";
import ManagerLayout from "@/components/layouts/_layout.manager";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  IconCheck,
  IconEdit,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { MantineReactTable } from "mantine-react-table";
import React, { useCallback, useMemo, useState } from "react";
import useSWR from "swr";

export default function RequestedTag() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const theme = useMantineTheme();
  const [validationErrors, setValidationErrors] = useState({});
  const {
    data: reqTags,
    isLoading: reqLoading,
    mutate: reqMutate,
    error: reqError,
  } = useSWR(user ? `requested-tag` : null, async () => {
    const { data, error } = await supabase
      .from("requested_tag")
      .select("*")
      .order("requests", { ascending: false });
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    if (data) return data;
  });
  const { data, error, isLoading, mutate } = useSWR(
    user ? "tag" : null,
    async () => {
      const { data, error } = await supabase
        .from("tag")
        .select("*")
        .order("name");
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      if (data) return data;
    }
  );
  const getCommonEditTextInputProps = useCallback(
    (cell) => {
      return {
        error: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "name" &&
            validateRequired(event.target.value) &&
            /^[A-Za-z0-9]*$/.test(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is invalid`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );
  const reqColumns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "requests",
        header: "Requested Times",
      },
    ],
    []
  );
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
    ],
    [getCommonEditTextInputProps]
  );
  const handleAddToTag = (row) => {
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          Are you sure to add <b>{row.original.name}</b> tag?
        </Text>
      ),
      labels: { confirm: "Add", cancel: "Cancel" },
      onConfirm: async () => {
        const { data, error } = await supabase
          .from("tag")
          .insert({ name: row.original.name });
        const { data: delData, error: delErr } = await supabase
          .from("requested_tag")
          .delete()
          .eq("id", row.original.id)
          .select("id");
        if (error || delErr) {
          console.log(error);
          console.log(delErr);
          notifications.show({
            title: "An error occurs",
            message: "Could not add this tag",
            icon: <IconX />,
            color: "red",
          });
          modals.closeAll();
        }
        if (delData) {
          notifications.show({
            title: "Tag added successfully",
            icon: <IconCheck />,
            color: theme.fn.primaryColor(),
          });
          reqMutate();
        }
      },
      onCancel: () => modals.closeAll(),
    });
  };
  const handleDeleteReqTag = (row) => {
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          Are you sure to delete <b>{row.original.name}</b>?
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const { data, error } = await supabase
          .from("requested_tag")
          .delete()
          .eq("id", row.original.id);
        if (error) {
          console.log(error);
          notifications.show({
            title: "An error occurs",
            message: "Could not delete this tag",
            icon: <IconX />,
            color: "red",
          });
          modals.closeAll();
        } else {
          notifications.show({
            title: "Tag deleted successfully",
            icon: <IconCheck />,
            color: theme.fn.primaryColor(),
          });
          reqMutate();
        }
      },
      onCancel: () => modals.closeAll(),
    });
  };
  const handleCreateNew = () => {
    modals.open({
      title: "Create new tag",
      children: <HandleCreate mutate={mutate} />,
    });
  };
  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      const { error } = await supabase
        .from("tag")
        .update({
          name: values.name,
        })
        .eq("id", row.original.id);
      if (error) {
        console.log(error);
        notifications.show({
          title: "An error occurs",
          message: `Could not update tag`,
          icon: <IconX />,
          color: "red",
        });
      } else {
        data[row.index] = values;
        mutate(data);
        notifications.show({
          title: "Tag updated successfully",
          icon: <IconCheck />,
        });
      }
      exitEditingMode();
    }
  };
  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };
  return (
    <ManagerLayout>
      <Title my="md">Requested tags</Title>
      <MantineReactTable
        data={reqTags || []}
        columns={reqColumns}
        enableDensityToggle={false}
        positionActionsColumn="first"
        enableColumnOrdering
        enableEditing
        mantineToolbarAlertBannerProps={
          reqError
            ? {
                color: "error",
                children: "Error loading data",
              }
            : undefined
        }
        state={{
          isLoading: reqLoading,
          showAlertBanner: reqError,
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "16px" }}>
            <Tooltip withArrow position="left" label="Add to tag">
              <ActionIcon onClick={() => handleAddToTag(row)}>
                <IconPlus />
              </ActionIcon>
            </Tooltip>
            <Tooltip withArrow position="right" label="Delete">
              <ActionIcon color="red" onClick={() => handleDeleteReqTag(row)}>
                <IconTrash />
              </ActionIcon>
            </Tooltip>
          </Box>
        )}
      />
      <Title my={"md"}>Current tags</Title>
      <MantineReactTable
        data={data || []}
        columns={columns}
        enableDensityToggle={false}
        positionActionsColumn="first"
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
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
            + New Tag
          </Button>
        )}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "16px" }}>
            <Tooltip withArrow position="left" label="Edit">
              <ActionIcon onClick={() => table.setEditingRow(row)}>
                <IconEdit />
              </ActionIcon>
            </Tooltip>
          </Box>
        )}
      />
    </ManagerLayout>
  );
}

RequestedTag.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps(ctx) {
  return {
    props: {
      metaTitle: "Tag",
    },
  };
}

const validateRequired = (value) => !!value.length;

function HandleCreate({ mutate }) {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) => (/^[A-Za-z0-9]*$/.test(value) ? null : "Invalid tag"),
    },
  });
  const handleSubmit = form.onSubmit(async (values) => {
    const { data, error } = await supabase
      .from("tag")
      .insert(values)
      .select("id");
    if (error) {
      console.log(error);
      notifications.show({
        title: "An error occurs",
        message: `Could not add tag`,
        icon: <IconX />,
        color: "red",
      });
      modals.closeAll();
    }
    if (data) {
      notifications.show({
        title: "Tag created successfully",
        icon: <IconCheck />,
      });
      mutate();
      modals.closeAll();
    }
  });
  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        required
        placeholder="Enter tag"
        label="Name"
        description={"Only letters and numbers. No whitespace allowed."}
        {...form.getInputProps("name")}
      />
      <Group position="right" mt="sm">
        <Button variant="light" onClick={() => modals.closeAll()}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

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
import { IconCheck, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { MantineReactTable } from "mantine-react-table";
import React, { useCallback, useMemo, useState } from "react";
import useSWR from "swr";

export default function PracticeManage() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const theme = useMantineTheme();
  const [validationErrors, setValidationErrors] = useState({});
  const getCommonEditTextInputProps = useCallback(
    (cell) => {
      return {
        error: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "title" && validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
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
  const { data, isLoading, error, mutate } = useSWR(
    user ? "practice" : null,
    async () => {
      const { data, error } = await supabase
        .rpc("get_practice_count_challenge")
        .select("*")
        .order("title");
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
        accessorKey: "title",
        header: "Title",
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: "challenge_count",
        header: "Challenges",
        mantineEditTextInputProps: { disabled: true },
      },
    ],
    [getCommonEditTextInputProps]
  );
  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      const { error } = await supabase
        .from("practice")
        .update({
          title: values.title,
        })
        .eq("id", row.original.id);
      if (error) {
        console.log(error);
        notifications.show({
          title: "An error occurs",
          message: `Could not update practice`,
          icon: <IconX />,
          color: "red",
        });
      } else {
        data[row.index] = values;
        mutate(data);
        notifications.show({
          title: "Practice updated successfully",
          icon: <IconCheck />,
        });
      }
      exitEditingMode();
    }
  };
  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };
  const handleCreateNew = () => {
    modals.open({
      title: "Create new practice",
      children: <HandleCreate mutate={mutate} />,
    });
  };
  const handleDeleteRow = (row) => {
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          Are you sure to delete <b>{row.getValue("title")}</b>?
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => modals.closeAll(),
      onConfirm: async () => {
        const { error, data } = await supabase
          .from("practice")
          .delete()
          .eq("id", row.original.id)
          .select("id")
          .single();
        if (data) {
          notifications.show({
            title: "Practice deleted successfully",
            icon: <IconCheck />,
          });
          modals.closeAll();
          mutate();
        }
        if (error) {
          notifications.show({
            title: "Could not delete practice",
            message: `This practice might contains one or more challenges.`,
            icon: <IconX />,
            color: "red",
          });
        }
      },
    });
  };
  return (
    <ManagerLayout>
      <Title my="md">Practice Group Management</Title>
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
            + New Practice
          </Button>
        )}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "16px" }}>
            <Tooltip withArrow position="left" label="Edit">
              <ActionIcon onClick={() => table.setEditingRow(row)}>
                <IconEdit />
              </ActionIcon>
            </Tooltip>
            <Tooltip withArrow position="right" label="Delete">
              <ActionIcon
                color="red"
                onClick={() => handleDeleteRow(row)}
                disabled={row.original.challenge_count != 0}
              >
                <IconTrash />
              </ActionIcon>
            </Tooltip>
          </Box>
        )}
      />
    </ManagerLayout>
  );
}

PracticeManage.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps(ctx) {
  return {
    props: {
      metaTitle: "Practice Management",
    },
  };
}

const validateRequired = (value) => !!value.length;

function HandleCreate({ mutate }) {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: {
      title: "",
    },
  });
  const handleSubmit = form.onSubmit(async (values) => {
    const { data, error } = await supabase
      .from("practice")
      .insert(values)
      .select("id");
    if (error) {
      console.log(error);
      notifications.show({
        title: "An error occurs",
        message: `Could not add practice`,
        icon: <IconX />,
        color: "red",
      });
      modals.closeAll();
    }
    if (data) {
      notifications.show({
        title: "Practice created successfully",
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
        placeholder="Enter practice name"
        label="Title"
        {...form.getInputProps("title")}
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

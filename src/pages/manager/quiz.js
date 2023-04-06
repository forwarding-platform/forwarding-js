import Layout from "@/components/layouts/_layout";
import ManagerLayout from "@/components/layouts/_layout.manager";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  NativeSelect,
  Select,
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
  IconGlobe,
  IconLock,
  IconTrash,
  IconWorldUpload,
  IconX,
} from "@tabler/icons-react";
import { MantineReactTable } from "mantine-react-table";
import React, { useCallback, useMemo, useState } from "react";
import useSWR from "swr";

export default function QuizManage() {
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
            cell.column.id === "name" && validateRequired(event.target.value);
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
        .from("quiz")
        .select("*, profile(id, email)")
        .order("created_at", { ascending: false });
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
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: "description",
        header: "Description",
        Cell: ({ cell }) =>
          cell.getValue("description") ? (
            <Text lineClamp={2}>{cell.getValue("description")}</Text>
          ) : (
            <Text color="dimmed">No description</Text>
          ),
      },
      {
        accessorKey: "profile.email",
        header: "Author",
        Edit: () => null,
      },
      {
        accessorKey: "published",
        header: "Status",
        Cell: ({ cell }) => (
          <Group>
            <Text>{cell.getValue("published") ? "Published" : "Private"}</Text>
          </Group>
        ),
        Edit: () => null,
      },
    ],
    [getCommonEditTextInputProps]
  );
  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      const { error } = await supabase
        .from("quiz")
        .update({
          name: values.name,
          description: values.description,
          published: values.published,
        })
        .eq("id", row.original.id);
      if (error) {
        console.log(error);
        notifications.show({
          title: "An error occurs",
          message: `Could not update quiz`,
          icon: <IconX />,
          color: "red",
        });
      } else {
        data[row.index] = values;
        mutate(data);
        notifications.show({
          title: "Quiz updated successfully",
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
      title: "Create new quiz",
      children: <HandleCreate mutate={mutate} />,
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
        const { error, data } = await supabase
          .from("quiz")
          .delete()
          .eq("id", row.original.id)
          .select("id")
          .single();
        if (data) {
          notifications.show({
            title: "Quiz group deleted successfully",
            icon: <IconCheck />,
          });
          modals.closeAll();
          mutate();
        }
        if (error) {
          notifications.show({
            title: "Could not delete quiz group",
            message: `This practice might contains one or more quizzes.`,
            icon: <IconX />,
            color: "red",
          });
        }
      },
    });
  };
  const makePublished = async (row) => {
    const { data, error } = await supabase
      .from("quiz")
      .update({ published: !row.original.published })
      .eq("id", row.original.id)
      .select("id");
    if (error) {
      console.log(error);
      notifications.show({
        title: "Could not update quiz status",
        icon: <IconX />,
        color: "red",
      });
    }
    if (data) {
      notifications.show({
        title: "Quiz status updated successfully",
        icon: <IconCheck />,
      });
      mutate();
    }
  };
  return (
    <ManagerLayout>
      <Title my="md">Quiz Group Management</Title>
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
            + New Quiz Group
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
              <ActionIcon color="red" onClick={() => handleDeleteRow(row)}>
                <IconTrash />
              </ActionIcon>
            </Tooltip>
            <Tooltip
              withArrow
              position="right"
              label={row.original.published ? "Make Private" : "Publish"}
            >
              <ActionIcon onClick={() => makePublished(row)}>
                {row.original.published ? <IconLock /> : <IconWorldUpload />}
              </ActionIcon>
            </Tooltip>
          </Box>
        )}
      />
    </ManagerLayout>
  );
}

QuizManage.getLayout = (page) => <Layout>{page}</Layout>;
export async function getStaticProps(ctx) {
  return {
    props: {
      metaTitle: "Quiz Group Management",
    },
  };
}

const validateRequired = (value) => !!value.length;

function HandleCreate({ mutate }) {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const user = useUser();
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      published: false,
      profile_id: user?.id,
    },
  });
  const handleSubmit = form.onSubmit(async (values) => {
    const { data, error } = await supabase
      .from("quiz")
      .insert(values)
      .select("id");
    if (error) {
      console.log(error);
      notifications.show({
        title: "An error occurs",
        message: `Could not add quiz group`,
        icon: <IconX />,
        color: "red",
      });
      modals.closeAll();
    }
    if (data) {
      notifications.show({
        title: "Quiz group created successfully",
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
        placeholder="Enter quiz group name"
        label="Name"
        {...form.getInputProps("name")}
      />
      <TextInput
        placeholder="Enter description"
        label="Description"
        {...form.getInputProps("description")}
      />
      <Select
        data={[
          { label: "Published", value: true },
          { label: "Private", value: false },
        ]}
        required
        label="Status"
        {...form.getInputProps("published")}
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

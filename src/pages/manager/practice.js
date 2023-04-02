import MarkdownParser from "@/components/common/MarkdownParser";
import Layout from "@/components/layouts/_layout";
import ManagerLayout from "@/components/layouts/_layout.manager";
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Input,
  NumberInput,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  IconCheck,
  IconEdit,
  IconEye,
  IconEyeOff,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { MantineReactTable } from "mantine-react-table";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export default function PracticeManage() {
  const theme = useMantineTheme();
  const supabase = useSupabaseClient();
  const user = useUser();
  const {
    data: practices,
    mutate,
    error,
    isLoading,
  } = useSWR(user ? "practice-challenge" : null, async () => {
    const { data, error } = await supabase
      .from("practice_challenge")
      .select("*, profile(email), practice(title)");
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    if (data) return data;
  });
  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        Cell: ({ cell }) => (
          <Anchor
            component={Link}
            href={"/challenge/" + cell.row.original.slug}
            target="_blank"
          >
            {cell.getValue("title")}
          </Anchor>
        ),
      },
      {
        accessorKey: "content",
        header: "Content",
        Cell: ({ cell }) => (
          <Text lineClamp={2}>{cell.getValue("content")}</Text>
        ),
      },
      {
        accessorKey: "practice.title",
        header: "Practice",
      },
      {
        accessorKey: "difficulty",
        header: "Difficulty",
      },
      {
        accessorKey: "score",
        header: "Score",
      },
      {
        accessorKey: "profile.email",
        header: "Author",
      },
    ],
    []
  );
  const handleCreateNew = () => {
    modals.open({
      title: "Create Challenge",
      children: <HandleCreate mutate={mutate} />,
      fullScreen: true,
    });
  };
  const handleUpdate = (row) => {
    modals.open({
      title: "Update Challenge",
      children: <HandleUpdate row={row} mutate={mutate} />,
      fullScreen: true,
    });
  };
  const handleDelete = (row) => {
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: <Text size="sm">Are you sure to delete this challenge?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const { data, error } = await supabase
          .from("practice_challenge")
          .delete()
          .eq("id", row.original.id);
        if (error) {
          console.log(error);
          notifications.show({
            title: "An error occurs",
            message: "Cannot delete this challenge",
            icon: <IconX />,
            color: "red",
          });
          modals.closeAll();
        } else {
          notifications.show({
            title: "Challenge deleted successfully",
            icon: <IconCheck />,
            color: theme.fn.primaryColor(),
          });
          mutate();
        }
      },
      onCancel: () => modals.closeAll(),
    });
  };
  return (
    <ManagerLayout>
      <Title my="md">Practice Challenge Management</Title>
      <MantineReactTable
        data={practices || []}
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
            + New Challenge
          </Button>
        )}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "16px" }}>
            <Tooltip withArrow position="left" label="Edit">
              <ActionIcon onClick={() => handleUpdate(row)}>
                <IconEdit />
              </ActionIcon>
            </Tooltip>
            <Tooltip withArrow position="right" label="Delete">
              <ActionIcon color="red" onClick={() => handleDelete(row)}>
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

export async function getServerSideProps(ctx) {
  return {
    props: {
      metaTitle: "Practice Challenge Management",
    },
  };
}

function HandleUpdate({ row, mutate }) {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const [preview, setPreview] = useState(false);
  const [practice, setPractice] = useState([]);
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("practice")
        .select("title, id");
      if (data) {
        setPractice(data);
      }
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
    })();
  }, [supabase]);
  const form = useForm({
    initialValues: {
      title: row.original.title,
      content: row.original.content,
      difficulty: row.original.difficulty,
      score: row.original.score,
      practice_id: row.original.practice_id,
      sample_input: row.original.sample_input,
      sample_output: row.original.sample_output,
      inputs: row.original.inputs,
      outputs: row.original.outputs,
    },
    validate: {
      score: (value) =>
        value < 5 || value > 150 || value % 5 !== 0
          ? "Invalid score (5-150)"
          : null,
    },
  });
  const IOs = form.values.inputs.map((item, index, arr) => (
    <div className="my-1 flex items-center gap-3" key={index}>
      <Textarea
        className="grow"
        required
        label={`Input ${index + 1}`}
        maxRows={2}
        aria-label={`input ${index + 1}`}
        {...form.getInputProps(`inputs.${index}`)}
      />
      <Textarea
        className="grow"
        required
        maxRows={2}
        label={`Output ${index + 1}`}
        aria-label={`output ${index + 1}`}
        {...form.getInputProps(`outputs.${index}`)}
      />
      <ActionIcon
        variant="subtle"
        disabled={arr.length <= 4}
        onClick={() => {
          form.removeListItem("inputs", index);
          form.removeListItem("outputs", index);
        }}
        title="Remove"
      >
        <IconX strokeWidth={1.5} />
      </ActionIcon>
    </div>
  ));
  const handleSubmit = form.onSubmit(async (values) => {
    const { data, error } = await supabase
      .from("practice_challenge")
      .update(values)
      .eq("id", row.original.id)
      .select("id");
    if (error) {
      console.log(error);
      notifications.show({
        title: "An error occurs",
        message: "Cannot delete this challenge",
        icon: <IconX />,
        color: "red",
      });
      modals.closeAll();
    }
    if (data) {
      notifications.show({
        title: "Challenge updated successfully",
        message: "It may take few minutes to apply changes",
        icon: <IconCheck />,
        color: theme.fn.primaryColor(),
      });
      mutate();
      modals.closeAll();
    }
  });
  return (
    <form onSubmit={handleSubmit}>
      <Group>
        <TextInput
          label="Title"
          {...form.getInputProps("title")}
          className="grow"
          required
        />
        <Select
          data={practice.map((p) => ({ label: p.title, value: p.id }))}
          label="Practice group"
          required
          {...form.getInputProps("practice_id")}
        />
        <Select
          data={["Easy", "Medium", "Hard", "Expert"]}
          label="Difficulty"
          required
          {...form.getInputProps("difficulty")}
        />
        <NumberInput
          label="Score"
          step={5}
          min={5}
          max={150}
          required
          {...form.getInputProps("score")}
        />
      </Group>
      <Divider
        variant="dotted"
        my="md"
        className={`${preview ? "block" : "hidden"}`}
      />
      <div className="ease flex flex-grow gap-5 transition-[width] duration-300">
        <Textarea
          autosize
          minRows={5}
          label="Content"
          required
          className="grow basis-1/2"
          rightSection={
            <ActionIcon title="Preview" onClick={() => setPreview(!preview)}>
              {preview ? (
                <IconEye strokeWidth={1.5} color={theme.fn.primaryColor()} />
              ) : (
                <IconEyeOff strokeWidth={1.5} color={theme.fn.primaryColor()} />
              )}
            </ActionIcon>
          }
          rightSectionProps={{
            style: { alignItems: "start", paddingTop: "5px" },
          }}
          {...form.getInputProps("content")}
        />
        <Box className={`${preview ? "block" : "hidden"} basis-1/2`}>
          <MarkdownParser>{form.values.content}</MarkdownParser>
        </Box>
      </div>
      <Divider
        variant="dotted"
        my="md"
        className={`${preview ? "block" : "hidden"}`}
      />
      <Group grow>
        <Textarea
          minRows={2}
          maxRows={5}
          autosize
          required
          label="Sample input"
          {...form.getInputProps("sample_input")}
        />
        <Textarea
          minRows={2}
          maxRows={4}
          required
          label="Sample output"
          {...form.getInputProps("sample_output")}
        />
      </Group>
      <div className="mt-3 grid grid-cols-2 gap-x-3">{IOs}</div>
      <Center>
        <Anchor
          align="center"
          variant="link"
          size="sm"
          onClick={() => {
            form.insertListItem("inputs", "");
            form.insertListItem("outputs", "");
          }}
          hidden={IOs.length >= 20}
        >
          Add more
        </Anchor>
      </Center>

      <Group my="sm" position="right">
        <Button variant="light" onClick={() => modals.closeAll()}>
          Cancel
        </Button>
        <Button disabled={!form.isDirty()} type="submit">
          Submit
        </Button>
      </Group>
    </form>
  );
}

function HandleCreate({ mutate }) {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const user = useUser();
  const [preview, setPreview] = useState(false);
  const [practice, setPractice] = useState([]);
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("practice")
        .select("title, id");
      if (data) {
        setPractice(data);
      }
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
    })();
  }, [supabase]);
  const form = useForm({
    initialValues: {
      title: "",
      content: "",
      difficulty: "Easy",
      score: 5,
      practice_id: null,
      sample_input: "",
      sample_output: "",
      inputs: ["", "", ""],
      outputs: ["", "", ""],
      profile_id: user?.id,
    },
    validate: {
      practice_id: (value) => (value ? null : "Select practice group"),
      score: (value) =>
        value < 5 || value > 150 || value % 5 !== 0
          ? "Invalid score (5-150)"
          : null,
    },
  });
  const IOs = form.values.inputs.map((item, index, arr) => (
    <div className="my-1 flex items-center gap-3" key={index}>
      <Textarea
        className="grow"
        required
        maxRows={2}
        label={`Input ${index + 1}`}
        aria-label={`input ${index + 1}`}
        {...form.getInputProps(`inputs.${index}`)}
      />
      <Textarea
        className="grow"
        required
        label={`Output ${index + 1}`}
        maxRows={2}
        aria-label={`output ${index + 1}`}
        {...form.getInputProps(`outputs.${index}`)}
      />
      <ActionIcon
        variant="subtle"
        disabled={arr.length <= 4}
        onClick={() => {
          form.removeListItem("inputs", index);
          form.removeListItem("outputs", index);
        }}
        title="Remove"
      >
        <IconX strokeWidth={1.5} />
      </ActionIcon>
    </div>
  ));
  const handleSubmit = form.onSubmit(async (values) => {
    const { data, error } = await supabase
      .from("practice_challenge")
      .insert(values)
      .select("id");
    if (error) {
      console.log(error);
      notifications.show({
        title: "An error occurs",
        message: "Cannot delete this challenge",
        icon: <IconX />,
        color: "red",
      });
      modals.closeAll();
    }
    if (data) {
      notifications.show({
        title: "Challenge created successfully",
        message: "It may take few minutes to apply changes",
        icon: <IconCheck />,
        color: theme.fn.primaryColor(),
      });
      mutate();
      modals.closeAll();
    }
  });
  return (
    <form onSubmit={handleSubmit}>
      <Group>
        <TextInput
          label="Title"
          {...form.getInputProps("title")}
          className="grow"
          required
        />
        <Select
          data={practice.map((p) => ({
            label: p.title,
            value: p.id,
          }))}
          label="Practice group"
          placeholder="Select practice group"
          required={true}
          {...form.getInputProps("practice_id")}
        />
        <Select
          data={["Easy", "Medium", "Hard", "Expert"]}
          label="Difficulty"
          required
          {...form.getInputProps("difficulty")}
        />
        <NumberInput
          label="Score"
          step={5}
          min={5}
          max={150}
          required
          {...form.getInputProps("score")}
        />
      </Group>
      <Divider
        variant="dotted"
        my="md"
        className={`${preview ? "block" : "hidden"}`}
      />
      <div className="ease flex flex-grow gap-5 transition-[width] duration-300">
        <Textarea
          autosize
          minRows={5}
          label="Content"
          required
          className="grow basis-1/2"
          rightSection={
            <ActionIcon title="Preview" onClick={() => setPreview(!preview)}>
              {preview ? (
                <IconEye strokeWidth={1.5} color={theme.fn.primaryColor()} />
              ) : (
                <IconEyeOff strokeWidth={1.5} color={theme.fn.primaryColor()} />
              )}
            </ActionIcon>
          }
          rightSectionProps={{
            style: { alignItems: "start", paddingTop: "5px" },
          }}
          {...form.getInputProps("content")}
        />
        <Box className={`${preview ? "block" : "hidden"} basis-1/2`}>
          <MarkdownParser>{form.values.content}</MarkdownParser>
        </Box>
      </div>
      <Divider
        variant="dotted"
        my="md"
        className={`${preview ? "block" : "hidden"}`}
      />
      <Group grow>
        <Textarea
          minRows={2}
          maxRows={5}
          autosize
          required
          label="Sample input"
          {...form.getInputProps("sample_input")}
        />
        <Textarea
          minRows={2}
          maxRows={4}
          required
          label="Sample output"
          {...form.getInputProps("sample_output")}
        />
      </Group>
      <div className="mt-3 grid grid-cols-2 gap-x-3">{IOs}</div>
      <Center>
        <Anchor
          align="center"
          variant="link"
          size="sm"
          onClick={() => {
            form.insertListItem("inputs", "");
            form.insertListItem("outputs", "");
          }}
          hidden={IOs.length >= 20}
        >
          Add more
        </Anchor>
      </Center>

      <Group my="sm" position="right">
        <Button variant="light" onClick={() => modals.closeAll()}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

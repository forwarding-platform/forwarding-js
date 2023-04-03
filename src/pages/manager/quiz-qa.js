import MarkdownParser from "@/components/common/MarkdownParser";
import Layout from "@/components/layouts/_layout";
import ManagerLayout from "@/components/layouts/_layout.manager";
import {
  ActionIcon,
  Alert,
  Anchor,
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Group,
  Input,
  NumberInput,
  Select,
  Stack,
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
  IconAlertCircle,
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

export default function QuizQA() {
  const theme = useMantineTheme();
  const supabase = useSupabaseClient();
  const user = useUser();
  const { data, mutate, error, isLoading } = useSWR(
    user ? "quiz-question" : null,
    async () => {
      const { data, error } = await supabase
        .from("quiz_question")
        .select("*, quiz(id, name), quiz_answer(*)");
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
        accessorKey: "question",
        header: "Question",
        Cell: ({ cell }) => <Text lineClamp={2}>{cell.getValue("title")}</Text>,
      },
      {
        accessorKey: "score",
        header: "Score",
      },
      {
        accessorKey: "quiz.name",
        header: "Quiz",
      },
    ],
    []
  );
  const handleCreateNew = () => {
    modals.open({
      title: "Create Challenge",
      children: <HandleCreate mutate={mutate} />,
      size: "90%",
    });
  };
  const handleUpdate = (row) => {
    modals.open({
      title: "Update Quiz",
      children: <HandleUpdate row={row} mutate={mutate} />,
      size: "90%",
    });
  };
  const handleDelete = (row) => {
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: <Text size="sm">Are you sure to delete this quiz?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const { data, error } = await supabase
          .from("quiz_question")
          .delete()
          .eq("id", row.original.id);
        if (error) {
          console.log(error);
          notifications.show({
            title: "An error occurs",
            message: "Could not delete this quiz",
            icon: <IconX />,
            color: "red",
          });
          modals.closeAll();
        } else {
          notifications.show({
            title: "Quiz deleted successfully",
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
      <Title my="md">Quizzes Management</Title>
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
            + New Quiz
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

QuizQA.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps(ctx) {
  return {
    props: {
      metaTitle: "Quizzes Management",
    },
  };
}

function HandleUpdate({ row, mutate }) {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const [quiz, setQuiz] = useState([]);
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("quiz").select("name, id");
      if (data) {
        setQuiz(data);
      }
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
    })();
  }, [supabase]);
  const form = useForm({
    initialValues: {
      question: row.original.question,
      score: row.original.score,
      quiz_id: row.original.quiz_id,
      answers: row.original.quiz_answer,
    },
    validate: {
      score: (value) =>
        value < 5 || value > 50 || value % 5 !== 0
          ? "Invalid score (5-50)"
          : null,
      answers: {
        correct: (value, values) =>
          values.answers.filter((a) => a.correct == true).length == 1
            ? null
            : "Invalid",
      },
    },
    validateInputOnChange: ["answers"],
  });
  const answerInputs = form.values.answers.map((item, index, arr) => (
    <div className=" flex items-center gap-3" key={index}>
      <Checkbox
        labelPosition="left"
        className=""
        label="Correct"
        {...form.getInputProps(`answers.${index}.correct`, {
          type: "checkbox",
        })}
      />
      <Textarea
        className="grow"
        required
        // label={`Input ${index + 1}`}
        maxRows={2}
        aria-label={`input ${index + 1}`}
        {...form.getInputProps(`answers.${index}.content`)}
      />
      <ActionIcon
        variant="subtle"
        disabled={arr.length <= 2}
        onClick={() => {
          form.removeListItem("answers", index);
        }}
        title="Remove"
      >
        <IconX strokeWidth={1.5} />
      </ActionIcon>
    </div>
  ));
  const handleSubmit = form.onSubmit(async (values) => {
    const { data, error } = await supabase
      .from("quiz_question")
      .update({
        question: values.question,
        score: values.score,
        quiz_id: values.quiz_id,
      })
      .eq("id", row.original.id)
      .select("id");
    if (error) {
      console.log(error);
      notifications.show({
        title: "An error occurs",
        message: "Could not update this quiz",
        icon: <IconX />,
        color: "red",
      });
      modals.closeAll();
    }
    if (data) {
      let tasks = [];
      values.answers.forEach((a) => {
        const task = supabase
          .from("quiz_answer")
          .update({
            content: a.content,
            correct: a.correct,
          })
          .eq("id", a.id)
          .select("id");
        tasks.push(task);
      });
      Promise.all(tasks).then(
        () => {
          notifications.show({
            title: "Quiz updated successfully",
            icon: <IconCheck />,
            color: theme.fn.primaryColor(),
          });
          mutate();
          modals.closeAll();
        },
        (error) => {
          console.log(error);
          notifications.show({
            title: "An error occurs",
            message: "Could not update this quiz",
            icon: <IconX />,
            color: "red",
          });
          modals.closeAll();
        }
      );
    }
  });
  return (
    <form onSubmit={handleSubmit}>
      <Group>
        <NumberInput
          label="Score"
          step={5}
          min={5}
          max={50}
          required
          {...form.getInputProps("score")}
        />
        <Select
          data={quiz.map((p) => ({ label: p.name, value: p.id }))}
          label="Quiz group"
          required
          {...form.getInputProps("quiz_id")}
        />
      </Group>
      <Textarea
        label="Question"
        required
        {...form.getInputProps("question")}
        autosize
        minRows={2}
        maxRows={5}
      />
      <Stack my="sm">{answerInputs}</Stack>
      <Center>
        <Anchor
          align="center"
          variant="link"
          size="sm"
          onClick={() => {
            form.insertListItem("answers", "");
          }}
          hidden={answerInputs.length >= 4}
        >
          Add more
        </Anchor>
      </Center>
      {form.values.answers.filter((a) => a.correct == true).length !== 1 && (
        <Alert
          color="red"
          title="One answer must be set as correct"
          icon={<IconAlertCircle />}
        >
          Try to set only one correct answer
        </Alert>
      )}
      <Group my="sm" position="right">
        <Button variant="light" onClick={() => modals.closeAll()}>
          Cancel
        </Button>
        <Button disabled={!form.isDirty() || !form.isValid()} type="submit">
          Submit
        </Button>
      </Group>
    </form>
  );
}

function HandleCreate({ mutate }) {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const [quiz, setQuiz] = useState([]);
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("quiz").select("name, id");
      if (data) {
        setQuiz(data);
      }
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
    })();
  }, [supabase]);
  const form = useForm({
    initialValues: {
      question: "",
      score: 5,
      quiz_id: null,
      answers: [{ correct: true }, {}, {}, {}],
    },
    validate: {
      score: (value) =>
        value < 5 || value > 50 || value % 5 !== 0
          ? "Invalid score (5-50)"
          : null,
      answers: {
        correct: (value, values) =>
          values.answers.filter((a) => a.correct == true).length == 1
            ? null
            : "Invalid",
      },
      quiz_id: (value) => (value ? null : "Select one quiz group"),
    },
    validateInputOnChange: ["answers"],
  });
  const answerInputs = form.values.answers.map((item, index, arr) => (
    <div className=" flex items-center gap-3" key={index}>
      <Checkbox
        labelPosition="left"
        className=""
        label="Correct"
        {...form.getInputProps(`answers.${index}.correct`, {
          type: "checkbox",
        })}
      />
      <Textarea
        className="grow"
        required
        // label={`Input ${index + 1}`}
        maxRows={2}
        aria-label={`input ${index + 1}`}
        {...form.getInputProps(`answers.${index}.content`)}
      />
      <ActionIcon
        variant="subtle"
        disabled={arr.length <= 2}
        onClick={() => {
          form.removeListItem("answers", index);
        }}
        title="Remove"
      >
        <IconX strokeWidth={1.5} />
      </ActionIcon>
    </div>
  ));
  const handleSubmit = form.onSubmit(async (values) => {
    const { data, error } = await supabase
      .from("quiz_question")
      .insert({
        question: values.question,
        score: values.score,
        quiz_id: values.quiz_id,
      })
      .select("id")
      .single();
    if (error) {
      console.log(error);
      notifications.show({
        title: "An error occurs",
        message: "Could not add quiz",
        icon: <IconX />,
        color: "red",
      });
      modals.closeAll();
    }
    if (data) {
      let tasks = [];
      values.answers.forEach((a) => {
        const task = supabase
          .from("quiz_answer")
          .insert({
            content: a.content,
            correct: a.correct,
            quiz_question_id: data.id,
          })
          .select("id");
        tasks.push(task);
      });
      Promise.all(tasks).then(
        () => {
          notifications.show({
            title: "Quiz added successfully",
            icon: <IconCheck />,
            color: theme.fn.primaryColor(),
          });
          mutate();
          modals.closeAll();
        },
        (error) => {
          console.log(error);
          notifications.show({
            title: "An error occurs",
            message: "Could not add quiz",
            icon: <IconX />,
            color: "red",
          });
          modals.closeAll();
        }
      );
    }
  });
  return (
    <form onSubmit={handleSubmit}>
      <Group>
        <NumberInput
          label="Score"
          step={5}
          min={5}
          max={50}
          required
          {...form.getInputProps("score")}
        />
        <Select
          data={quiz.map((p) => ({ label: p.name, value: p.id }))}
          label="Quiz group"
          required
          {...form.getInputProps("quiz_id")}
        />
      </Group>
      <Textarea
        label="Question"
        required
        {...form.getInputProps("question")}
        autosize
        minRows={2}
        maxRows={5}
      />
      <Stack my="sm">{answerInputs}</Stack>
      <Center>
        <Anchor
          align="center"
          variant="link"
          size="sm"
          onClick={() => {
            form.insertListItem("answers", "");
          }}
          hidden={answerInputs.length >= 4}
        >
          Add more
        </Anchor>
      </Center>
      {form.values.answers.filter((a) => a.correct == true).length !== 1 && (
        <Alert
          color="red"
          title="One answer must be set as correct"
          icon={<IconAlertCircle />}
        >
          Try to set only one correct answer
        </Alert>
      )}
      <Group my="sm" position="right">
        <Button variant="light" onClick={() => modals.closeAll()}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

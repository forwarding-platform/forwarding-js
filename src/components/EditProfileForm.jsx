import {
  ActionIcon,
  Alert,
  Anchor,
  Button,
  Group,
  LoadingOverlay,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput, DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { closeModal, modals } from "@mantine/modals";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { IconAlertCircle, IconX } from "@tabler/icons-react";
import { countries } from "countries-list";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { mutate } from "swr";

export default function EditProfileForm({ profile, skipBtn = false }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const supabase = useSupabaseClient();
  const router = useRouter();
  // init form interface
  const form = useForm({
    initialValues: {
      name: profile.name,
      username: profile.username,
      introduction: profile?.introduction || "",
      country: profile?.country || "",
      birthday: new Date(profile?.birthday),
      work: profile?.work || [],
      education: profile?.education || [],
      link: profile?.link || [],
    },
    validate: {
      name: (value) =>
        value.trim().length < 3
          ? "Name must have at least 3 letters"
          : value.trim().length > 50
          ? "Name must be at most 50 letters"
          : null,
      username: (value) =>
        /^(?=.{5,30}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(value)
          ? null
          : /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
              value
            )
          ? null
          : "Invalid username",
      introduction: (value) =>
        value.trim().length > 250
          ? "Introduction must be at most 250 letters"
          : null,
      birthday: (value) =>
        dayjs(value).isAfter(dayjs(new Date())) ? "Invalid date" : null,
    },
    validateInputOnChange: true,
  });

  // handle form submit
  const handleFormSubmit = form.onSubmit(async (value) => {
    const oldUsername = profile.username;
    setLoading(true);
    const { data, error } = await supabase
      .from("profile")
      .update(value)
      .eq("id", profile.id)
      .select("*")
      .single();
    if (error) {
      setLoading(false);
      setError(true);
      return;
    }
    if (data) {
      setLoading(false);
      closeModal("editProfile");
      mutate(["profile-by-username", data.username], data);
      if (oldUsername != data.username) {
        router.push(`/user/${data.username}`);
      }
    }
  });

  // render work inputs if any
  const workInputs = form.values.work.map((item, index) => (
    <div key={index} className="my-1 flex items-center gap-3">
      <TextInput
        className="grow"
        {...form.getInputProps(`work.${index}`)}
        rightSectionWidth="fit-content"
        required
        placeholder="Your work"
        aria-label={`work ${index + 1}`}
        onBlur={(e) =>
          form.setFieldValue(`work.${index}`, e.target.value.trim())
        }
      />
      <ActionIcon
        variant="subtle"
        onClick={() => {
          form.removeListItem("work", index);
        }}
        title="Remove"
      >
        <IconX strokeWidth={1.5} />
      </ActionIcon>
    </div>
  ));

  // render education inputs if any
  const educationInputs = form.values.education?.map((item, index) => (
    <div key={index} className="my-1 flex items-center gap-3">
      <TextInput
        className="grow"
        {...form.getInputProps(`education.${index}`)}
        rightSectionWidth="fit-content"
        required
        placeholder="Your education"
        aria-label={`education ${index + 1}`}
        onBlur={(e) =>
          form.setFieldValue(`education.${index}`, e.target.value.trim())
        }
      />
      <ActionIcon
        variant="subtle"
        onClick={() => {
          form.removeListItem("education", index);
        }}
        title="Remove"
      >
        <IconX strokeWidth={1.5} />
      </ActionIcon>
    </div>
  ));

  // render link inputs if any
  const linkInputs = form.values.link?.map((item, index) => (
    <div key={index} className="my-1 flex items-center gap-3">
      <TextInput
        className="grow"
        {...form.getInputProps(`link.${index}`)}
        rightSectionWidth="fit-content"
        required
        placeholder="Your link"
        aria-label={`link ${index + 1}`}
        onBlur={(e) =>
          form.setFieldValue(`link.${index}`, e.target.value.trim())
        }
      />
      <ActionIcon
        variant="subtle"
        onClick={() => {
          form.removeListItem("link", index);
        }}
        title="Remove"
      >
        <IconX strokeWidth={1.5} />
      </ActionIcon>
    </div>
  ));

  return (
    <div>
      <form autoComplete="off" onSubmit={handleFormSubmit}>
        <div className="flex flex-col gap-1">
          <LoadingOverlay visible={loading} overlayBlur={1} />
          <Text fw={700}>Basic information</Text>
          <TextInput
            label="Name"
            minLength={3}
            maxLength={50}
            required
            {...form.getInputProps("name")}
            onBlur={(e) => form.setFieldValue("name", e.target.value.trim())}
          />
          <TextInput
            label="Username"
            required
            {...form.getInputProps("username")}
          />
          <Textarea
            minRows={4}
            maxLength={250}
            label={
              <div className="flex w-full items-end justify-between">
                <span>Introduction</span>
                <Text color="dimmed" fw={400} size="xs">
                  {form.values.introduction?.length || 0}/250
                </Text>
              </div>
            }
            labelProps={{ className: "w-full" }}
            {...form.getInputProps("introduction")}
            onBlur={(e) =>
              form.setFieldValue("introduction", e.target.value.trim())
            }
          />
          <DateInput
            label="Birthday"
            valueFormat="MMM DD, YYYY"
            maxDate={dayjs(new Date()).toDate()}
            {...form.getInputProps("birthday")}
          />
          <Select
            label="Country"
            data={Object.entries(countries).map((item) => ({
              label: item[1].name,
              value: item[1].name,
            }))}
            searchable
            nothingFound="No options"
            allowDeselect
            clearable
            placeholder="Select country"
            {...form.getInputProps("country")}
            onBlur={(e) => form.setFieldValue("country", e.target.value.trim())}
          />
          <Text fw={700} mt="sm">
            Works
          </Text>
          {workInputs?.length > 0 ? (
            <>
              {workInputs}
              <Anchor
                align="center"
                variant="link"
                size="sm"
                onClick={() => form.insertListItem("work", "")}
                hidden={workInputs.length >= 5}
              >
                Add more
              </Anchor>
            </>
          ) : (
            <Anchor
              variant="link"
              align="center"
              size="sm"
              onClick={() => form.insertListItem("work", "")}
            >
              Add work
            </Anchor>
          )}
          <Text fw={700}>Education</Text>
          {educationInputs?.length > 0 ? (
            <>
              {educationInputs}
              <Anchor
                align="center"
                variant="link"
                size="sm"
                onClick={() => form.insertListItem("education", "")}
                hidden={educationInputs.length >= 5}
              >
                Add more
              </Anchor>
            </>
          ) : (
            <Anchor
              variant="link"
              align="center"
              size="sm"
              onClick={() => form.insertListItem("education", "")}
            >
              Add education
            </Anchor>
          )}
          <Text fw={700}>Link</Text>
          {linkInputs?.length > 0 ? (
            <>
              {linkInputs}
              <Anchor
                align="center"
                size="sm"
                variant="link"
                onClick={() => form.insertListItem("link", "")}
                hidden={linkInputs.length >= 5}
              >
                Add more
              </Anchor>
            </>
          ) : (
            <Anchor
              variant="link"
              align="center"
              size="sm"
              onClick={() => form.insertListItem("link", "")}
            >
              Add link
            </Anchor>
          )}
          {error && (
            <Alert
              icon={<IconAlertCircle />}
              title="Something went wrong"
              color="red"
              withCloseButton
              onClose={() => setError(false)}
            >
              An error occurs during your request!
            </Alert>
          )}
          <Group className="mt-5 self-end">
            <Button
              w="fit-content"
              variant="outline"
              onClick={() => modals.closeAll()}
            >
              {skipBtn ? "Skip for now" : "Cancel"}
            </Button>
            <Button
              w="fit-content"
              type="submit"
              disabled={!form.isDirty() || !form.isValid()}
            >
              {skipBtn ? "Save" : "Save Changes"}
            </Button>
          </Group>
        </div>
      </form>
    </div>
  );
}

import {
  Button,
  Group,
  Image,
  LoadingOverlay,
  rem,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";

export default function UploadImage({ handleLocalImage }) {
  const [file, setFile] = useState([]);
  const [visible, { open }] = useDisclosure(false);
  const theme = useMantineTheme();
  const openRef = useRef(null);
  return (
    <Stack>
      {file.length == 0 ? (
        <Dropzone
          openRef={openRef}
          maxFiles={1}
          accept={IMAGE_MIME_TYPE}
          maxSize={5 * 1024 ** 2}
          onReject={() => window.alert("File size exceeded!")}
          onDrop={setFile}
        >
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: rem(220), pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconUpload
                size="3.2rem"
                stroke={1.5}
                color={
                  theme.colors[theme.primaryColor][
                    theme.colorScheme === "dark" ? 4 : 6
                  ]
                }
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size="3.2rem"
                stroke={1.5}
                color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size="3.2rem" stroke={1.5} />
            </Dropzone.Idle>

            <div>
              <Text size="lg" align="center" inline>
                Drag images here or click to select files
              </Text>
              <Text size="sm" align="center" color="dimmed" inline mt={7}>
                File should not exceed 5mb
              </Text>
            </div>
          </Group>
        </Dropzone>
      ) : (
        <div className="relative">
          <Image
            src={URL.createObjectURL(file[0])}
            imageProps={{
              onLoad: () => URL.revokeObjectURL(URL.createObjectURL(file[0])),
            }}
            alt="Preview image"
          />
          <Group grow mt={"md"}>
            <Button
              variant="light"
              onClick={() => {
                setFile([]);
                openRef.current();
              }}
            >
              Select other
            </Button>
            <Button
              onClick={() => {
                open();
                handleLocalImage(file[0]);
              }}
            >
              Add image
            </Button>
          </Group>
          <LoadingOverlay visible={visible} />
        </div>
      )}
    </Stack>
  );
}

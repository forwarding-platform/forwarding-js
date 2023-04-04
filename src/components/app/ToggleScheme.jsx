import {
  useMantineColorScheme,
  SegmentedControl,
  Group,
  Center,
  Box,
  ActionIcon,
  Affix,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { IconSun, IconMoon, IconMoonStars } from "@tabler/icons-react";

export default function ToggleScheme() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  return (
    <Affix position={{ bottom: rem(20), left: rem(20) }}>
      <ActionIcon
        variant="light"
        size={"xl"}
        radius={"xl"}
        onClick={() => toggleColorScheme()}
      >
        {colorScheme === "dark" ? (
          <IconSun strokeWidth={1.5} />
        ) : (
          <IconMoonStars strokeWidth={1.5} />
        )}
      </ActionIcon>
    </Affix>
  );
}

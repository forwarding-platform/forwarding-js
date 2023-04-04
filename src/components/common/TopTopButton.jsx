import {
  ActionIcon,
  Affix,
  rem,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconChevronUp } from "@tabler/icons-react";
import React from "react";

export default function TopTopButton() {
  const [{ y }, scrollTo] = useWindowScroll();
  const theme = useMantineTheme();
  return (
    <Affix position={{ bottom: rem(20), right: rem(20) }}>
      <Transition transition="slide-up" mounted={y > 300}>
        {(transitionStyles) => (
          <ActionIcon
            variant="filled"
            color={theme.fn.primaryColor()}
            title="Scroll to top"
            size="xl"
            radius="xl"
            style={transitionStyles}
            onClick={() => scrollTo({ y: 0 })}
          >
            <IconChevronUp strokeWidth={1.5} />
          </ActionIcon>
        )}
      </Transition>
    </Affix>
  );
}

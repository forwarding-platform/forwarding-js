import { appSubLinks, headerLinks } from "@/constants/headerLinks";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  createStyles,
  Divider,
  Drawer,
  Group,
  Header,
  HoverCard,
  Menu,
  NavLink,
  Paper,
  rem,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import {
  useDisclosure,
  useViewportSize,
  useWindowScroll,
} from "@mantine/hooks";
import {
  IconChevronDown,
  IconLogout,
  IconSettings2,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import AppLogo from "./_logo";
import { usePathname } from "next/navigation";
import { useProfile } from "@/utils/hooks/profile";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";

export const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "50%",
    paddingLeft: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginLeft: "1px",
    marginRight: "1px",
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[8],
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,
    transition: "ease 500ms",

    [theme.fn.smallerThan("sm")]: {
      height: rem(42),
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[2],
    }),
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: `calc(${theme.spacing.md} * -1)`,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
    paddingBottom: theme.spacing.xl,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

export function AppHeader() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme, cx } = useStyles();
  const pathname = usePathname();
  const { width } = useViewportSize();
  const [{ y }] = useWindowScroll();
  const supabase = useSupabaseClient();
  const user = useUser();
  const { profile, error, isLoading, isValidating } = useProfile(
    "id",
    user?.id
  );

  const links = appSubLinks.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <div className="flex flex-nowrap items-center gap-4">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={rem(22)} color={theme.fn.primaryColor()} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" color="dimmed">
            {item.description}
          </Text>
        </div>
      </div>
    </UnstyledButton>
  ));

  return (
    <Paper>
      <Header
        className={`${y > 30 ? "shadow-md" : "shadow-none"}`}
        height={60}
        px="xs"
        withBorder={y < 30}
        bg={
          theme.colorScheme == "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[0]
        }
      >
        <Group position="apart" sx={{ height: "100%" }}>
          <AppLogo />
          <Group
            sx={{ height: "100%" }}
            spacing={0}
            className={classes.hiddenMobile}
          >
            {headerLinks.map((link, index) => (
              <UnstyledButton
                component={Link}
                href={link.href}
                key={index}
                className={cx(classes.link, {
                  [classes.linkActive]: pathname?.startsWith(link.href),
                })}
              >
                {link.label}
              </UnstyledButton>
            ))}
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Apps
                    </Box>
                    <IconChevronDown
                      size={16}
                      color={theme.fn.primaryColor()}
                    />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown sx={{ overflow: "hidden" }}>
                <Group position="apart" px="md">
                  <Text fw={500}>Apps</Text>
                  <Anchor href="#" fz="xs">
                    Explore more
                  </Anchor>
                </Group>

                <Divider
                  my="sm"
                  mx="-md"
                  color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
                />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group position="apart">
                    <div>
                      <Text fw={500} fz="sm">
                        Get started
                      </Text>
                      <Text size="xs" color="dimmed">
                        Sign up to utilize Apps in no time
                      </Text>
                    </div>
                    <Button variant="default">Get started</Button>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>

          <Group>
            {profile && user ? (
              <Menu
                width={300}
                shadow="xl"
                transitionProps={{ transition: "pop" }}
              >
                <Menu.Target>
                  <Avatar
                    src={profile.avatar_url}
                    alt={"My avatar"}
                    radius="xl"
                    component={UnstyledButton}
                    color={theme.primaryColor}
                    title="Account management"
                    // imageProps={{ refererPolicy: "no-referer" }}
                  />
                </Menu.Target>
                <Menu.Dropdown className="rounded-lg shadow-md">
                  {/* </Menu.Item> */}
                  <Menu.Item
                    py="sm"
                    icon={<IconUser size={14} />}
                    component={Link}
                    href={`/user/${profile.username}`}
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Item py="sm" icon={<IconSettings2 size={14} />}>
                    Settings
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    py="sm"
                    icon={<IconLogout size={14} />}
                    onClick={async () => {
                      const { error } = await supabase.auth.signOut();
                      // mutate();
                    }}
                  >
                    Sign out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Group className={classes.hiddenMobile} spacing={5}>
                <Button
                  size="xs"
                  variant="outline"
                  component={Link}
                  href="/auth/signin"
                >
                  Sign in
                </Button>
                <Button
                  size="xs"
                  variant="filled"
                  component={Link}
                  href="/auth/signup"
                >
                  Sign up
                </Button>
              </Group>
            )}

            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              className={classes.hiddenDesktop}
              hidden={width < 768 && width >= 767}
            />
          </Group>
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        title={<AppLogo />}
        className={classes.hiddenDesktop}
      >
        <Divider
          my="sm"
          color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
        />

        {headerLinks.map((link, index) => (
          <UnstyledButton
            component={Link}
            href={link.href}
            key={index}
            className={classes.link}
          >
            {link.label}
          </UnstyledButton>
        ))}
        <UnstyledButton className={classes.link} onClick={toggleLinks} w="100%">
          <Center inline>
            <Box component="span" mr={5}>
              Apps
            </Box>
            <IconChevronDown size={16} color={theme.fn.primaryColor()} />
          </Center>
        </UnstyledButton>
        <Collapse in={linksOpened}>{links}</Collapse>

        <Divider
          my="sm"
          color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
        />

        {!profile ||
          (!user && (
            <Group position="center" grow pb="xl" px="md">
              <Button
                size="xs"
                variant="outline"
                component={Link}
                href="/auth/signin"
              >
                Sign in
              </Button>
              <Button
                size="xs"
                variant="filled"
                component={Link}
                href="/auth/signup"
              >
                Sign up
              </Button>
            </Group>
          ))}
      </Drawer>
    </Paper>
  );
}

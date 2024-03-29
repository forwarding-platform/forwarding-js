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
  IconBookmarks,
  IconChevronDown,
  IconLogout,
  IconPencil,
  IconPencilPlus,
  IconSettings2,
  IconShieldLock,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import AppLogo from "./_logo";
import { usePathname } from "next/navigation";
import { useProfile } from "@/utils/hooks/profile";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  const router = useRouter();
  const user = useUser();
  const { profile, error, isLoading, isValidating } = useProfile(
    "id",
    user?.id
  );

  useEffect(() => {
    closeDrawer();
  }, [closeDrawer, router.pathname]);

  const links = appSubLinks.map((item) => (
    <UnstyledButton
      className={classes.subLink}
      key={item.title}
      onClick={() => router.push(item.href)}
    >
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
                // onClick={() => router.push(link.href)}
                key={index}
                className={cx(classes.link, {
                  [classes.linkActive]:
                    link.href != "/practice"
                      ? pathname?.startsWith(link.href)
                      : pathname?.startsWith(link.href) ||
                        pathname?.startsWith("/challenge"),
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
                  {/* <Anchor href="#" fz="xs">
                    Explore more
                  </Anchor> */}
                </Group>

                <Divider
                  my="sm"
                  mx="-md"
                  color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
                />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                {!user && (
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
                      <Button
                        variant="default"
                        onClick={() => router.push("/auth/signin")}
                      >
                        Get started
                      </Button>
                    </Group>
                  </div>
                )}
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
                  <UnstyledButton>
                    <Image
                      src={
                        profile.avatar_url
                          ? profile.avatar_url.includes("googleusercontent")
                            ? profile.avatar_url
                            : `https://kirkgtkhcjuemrllhngq.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`
                          : `https://robohash.org/${profile.email}`
                      }
                      width={36}
                      height={36}
                      priority
                      alt="My avatar"
                      title="Account management"
                      className="rounded-full"
                    />
                  </UnstyledButton>
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
                  <Menu.Item
                    py="sm"
                    icon={<IconPencilPlus size={14} />}
                    component={Link}
                    href={`/creator/post`}
                  >
                    New post
                  </Menu.Item>
                  <Menu.Item
                    py="sm"
                    icon={<IconPencilPlus size={14} />}
                    component={Link}
                    href={`/creator/question`}
                  >
                    New question
                  </Menu.Item>
                  <Menu.Item
                    py="sm"
                    icon={<IconBookmarks size={14} />}
                    component={Link}
                    href={`/user/${profile.username}/bookmarked`}
                  >
                    Bookmarked
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    py="sm"
                    icon={<IconLogout size={14} />}
                    onClick={async () => {
                      const { error } = await supabase.auth.signOut();
                      if (!error) router.reload();
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
              title="Open Menu"
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
            // onClick={() => router.push(link.href)}
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
        {!user && (
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
        )}
      </Drawer>
    </Paper>
  );
}

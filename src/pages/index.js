import Layout from "@/components/layouts/_layout";
import {
  Button,
  Container,
  Divider,
  Group,
  SimpleGrid,
  Space,
  Text,
  Title,
  createStyles,
  getStylesRef,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";
import {
  IconApps,
  IconArticle,
  IconMessageQuestion,
  IconTerminal,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  feature: {
    position: "relative",
    paddingTop: theme.spacing.xl,
    paddingLeft: theme.spacing.xl,
    paddingBlock: theme.spacing.xl,
    [`&:hover .${getStylesRef("overlay")}`]: {
      width: "100%",
      height: "100%",
    },
  },

  overlay: {
    ref: getStylesRef("overlay"),
    position: "absolute",
    height: rem(100),
    width: rem(160),
    transitionProperty: "all",
    transitionTimingFunction: "ease-in-out",
    transitionDuration: "150ms",
    top: 0,
    left: 0,
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: theme.fn.primaryColor(),
    }).background,
    zIndex: 1,
  },

  content: {
    position: "relative",
    zIndex: 2,
  },

  icon: {
    color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
      .color,
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },
}));

const mockdata = [
  {
    icon: IconTerminal,
    title: "Practice Challenge",
    description:
      "Improve your coding skills by offering a curated set of programming problems.",
    href: "/practice",
  },
  {
    icon: IconArticle,
    title: "Posts",
    description:
      "Share knowledge with others in the community, providing an opportunity for mutual growth and learning.",
    href: "/post",
  },
  {
    icon: IconMessageQuestion,
    title: "Question and Answer",
    description:
      "Opportunity to get help from experienced programmers and learn from others' experiences",
    href: "/qna",
  },
  {
    icon: IconApps,
    title: "Apps",
    description:
      "Quizzes, Node.js Sandbox, and Code Runner allow you to quickly test your code or your knowledge",
  },
];

export default function Index() {
  const user = useUser();
  const router = useRouter();
  const theme = useMantineTheme();
  const items = mockdata.map((item) => <Feature {...item} key={item.title} />);

  return (
    <>
      <Container>
        <div className="mt-20 flex flex-1 flex-col items-center justify-center px-4 text-center sm:mt-20">
          <Text
            color={
              theme.colorScheme == "dark"
                ? theme.colors.gray[2]
                : theme.colors.dark[4]
            }
            className={`font-display mx-auto max-w-4xl text-4xl font-bold tracking-normal sm:text-7xl`}
          >
            Learn, share, practice{" "}
            <Text
              component="span"
              color={theme.colors.grape}
              className="relative whitespace-nowrap"
            >
              <SquigglyLines />
              <span className="relative">with Forwarding</span>
            </Text>{" "}
            easier than ever.
          </Text>
          <Title
            order={2}
            color="dimmed"
            className="mx-auto mt-12 max-w-xl text-lg leading-7"
          >
            The future of online programming education and community learning.
            Join the Forwarding community today.
          </Title>
          {!user && (
            <Group>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/explore")}
                className="mt-8 rounded-xl px-4 py-3 font-medium transition sm:mt-10"
              >
                Explore
              </Button>
              <Button
                component={Link}
                size="lg"
                className="mt-8 rounded-xl px-4 py-3 font-medium transition sm:mt-10"
                href="/auth/signin"
              >
                Sign up now
              </Button>
            </Group>
          )}
        </div>
        <Space h={user ? 200 : 150} />
        <Divider
          label={<Title order={1}>Features</Title>}
          labelPosition="center"
          my="lg"
        />
        <SimpleGrid
          cols={2}
          breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          spacing={50}
        >
          {items}
        </SimpleGrid>
      </Container>
    </>
  );
}

Index.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps(ctx) {
  return {
    props: {
      metaTitle: "Home",
    },
  };
}

function SquigglyLines() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 418 42"
      className="absolute top-2/3 left-0 h-[0.58em] w-full fill-purple-500/60"
      preserveAspectRatio="none"
    >
      <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
    </svg>
  );
}

function Feature({
  icon: Icon,
  title,
  href,
  description,
  className,
  ...others
}) {
  const { classes, cx } = useStyles();
  return (
    <Link
      className={cx(classes.feature, className)}
      {...others}
      href={href || "#"}
      shallow={href ? false : true}
    >
      <div className={classes.overlay} />

      <div className={classes.content}>
        <Icon size={rem(38)} className={classes.icon} stroke={1.5} />
        <Text fw={700} fz="lg" mb="xs" mt={5} className={classes.title}>
          {title}
        </Text>
        <Text c="dimmed" fz="sm">
          {description}
        </Text>
      </div>
    </Link>
  );
}

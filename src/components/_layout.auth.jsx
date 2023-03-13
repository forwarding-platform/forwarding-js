import AppLogo from "@/components/_logo";
import { Carousel } from "@mantine/carousel";
import { Box, Paper, rem, Text, Title, useMantineTheme } from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRef } from "react";

export default function AuthLayout({ children }) {
  const theme = useMantineTheme();
  const autoplay = useRef(Autoplay({ delay: 4000 }));
  return (
    <Box
      className="flex h-full min-h-screen w-full flex-1"
      p={{ base: "xl", lg: 0 }}
      style={{
        backgroundColor:
          theme.colorScheme == "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[2],
      }}
    >
      <Box
        className="flex flex-1 flex-col md:basis-1/2 lg:basis-3/5"
        bg={{
          lg: theme.colorScheme == "dark" ? theme.colors.dark[7] : theme.white,
        }}
      >
        <div className="mb-10 flex justify-center md:m-4 md:grow md:items-start md:justify-start">
          <AppLogo />
        </div>
        <Paper
          radius="md"
          py="md"
          px="md"
          className="self-center md:mb-5 lg:grow"
          w={{ base: 400 }}
          bg={theme.colorScheme == "dark" ? theme.colors.dark[7] : theme.white}
        >
          {children}
        </Paper>
      </Box>
      <section className="hidden flex-col md:flex md:flex-1 lg:basis-2/5">
        <Carousel
          maw={"100%"}
          w="100%"
          height={"175px"}
          plugins={[autoplay.current]}
          withIndicators
          loop
          withControls={false}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
          styles={{
            indicator: {
              width: rem(10),
              height: rem(10),
              margin: "0 5px",
              backgroundColor:
                theme.colorScheme == "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[4],
              transition: "all ease 250ms",
              "&[data-active]": {
                backgroundColor: theme.fn.primaryColor(theme.colorScheme),
              },
            },
          }}
          className="mt-24"
        >
          <Carousel.Slide>
            <Title order={2} align="center" mb={"md"}>
              Sharpen your skills <br /> share your knowledge
            </Title>
            <Text align="center" size={"sm"} color="dimmed">
              Practice coding, share expertise, and compete with others
            </Text>
          </Carousel.Slide>
          <Carousel.Slide>
            <Title order={2} align="center" mb={"md"}>
              Learn, collaborate, grow
            </Title>
            <Text align="center" size={"sm"} color="dimmed">
              Learning-focused web app, featuring forums and peer mentoring.
            </Text>
          </Carousel.Slide>
          <Carousel.Slide>
            <Title order={2} align="center" mb={"md"}>
              Code smarter, <br /> not harder
            </Title>
            <Text align="center" size={"sm"} color="dimmed">
              Accessible web app, designed for efficient, effective learning and
              skill-building.
            </Text>
          </Carousel.Slide>
        </Carousel>
        <div className="relative grow">
          <Image
            src={"/auth-illustrate.svg"}
            fill
            alt="Authentication illustration"
          />
        </div>
      </section>
    </Box>
  );
}

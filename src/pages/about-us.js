import Layout from "@/components/layouts/_layout";
import { Container } from "@mantine/core";

export default function AboutUs() {
  return (
    <Container>
      <h1>About Us</h1>
      <p>
        Welcome to Forwarding, the community-driven platform for programmers to
        learn, share, and practice their coding skills. Our mission is to
        empower programmers of all skill levels to advance their knowledge and
        thrive in the ever-evolving field of software development.
      </p>
      <h2>Our Vision</h2>
      <p>
        At Forwarding, we believe that knowledge should be accessible and shared
        openly. We aim to create a vibrant and inclusive community where
        programmers from all backgrounds can connect, collaborate, and learn
        from each other. Our vision is to foster a culture of continuous
        learning and improvement, where members can contribute their expertise,
        engage in meaningful discussions, and elevate their coding skills to new
        heights.
      </p>
      <h2>What We Offer</h2>
      <p>
        Forwarding offers a wide range of features designed to help programmers
        excel in their craft. From practice challenges that sharpen algorithmic
        skills to blog posts that share insights and experiences, our platform
        provides an immersive and interactive learning environment. Our Q&A
        section allows members to seek help and provide solutions, fostering a
        supportive and collaborative community. We also provide resources,
        tutorials, and coding guidelines to assist users in their learning
        journey.
      </p>
      <h2>Our Commitment</h2>
      <p>
        At Forwarding, we are committed to providing a safe and inclusive space
        for all members. We prioritize respect, diversity, and inclusivity, and
        we have a zero-tolerance policy towards discrimination, harassment, and
        harmful behavior. Our community guidelines ensure that all members can
        learn, share, and collaborate in a positive and respectful environment.
      </p>
      <h2>Join Us Today!</h2>
      <p>
        We invite you to join the Forwarding community and be a part of our
        mission to empower programmers worldwide. Whether you are a beginner
        just starting out or an experienced developer looking to level up your
        skills, we have something to offer. Let&apos;s learn, share, and
        practice together, and make the world of programming better, easier, and
        more enjoyable for everyone!
      </p>
    </Container>
  );
}

AboutUs.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps(ctx) {
  return {
    props: {
      metaTitle: "About",
    },
  };
}

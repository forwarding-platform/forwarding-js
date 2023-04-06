import Layout from "@/components/layouts/_layout";
import { Anchor, Container } from "@mantine/core";
import React from "react";

export default function Privacy() {
  return (
    <Container>
      <h1>Privacy Policy</h1>
      <p>
        Your privacy is important to us. This Privacy Policy describes how
        Forwarding collects, uses, and discloses information collected from
        users of the Forwarding platform.
      </p>
      <h2>1. Information Collection</h2>
      <p>
        We may collect personally identifiable information, such as your name,
        email address, and other contact information, when you voluntarily
        provide it to us through the Service. We may also collect non-personally
        identifiable information, such as log data, cookies, and usage
        information, to improve the Service and enhance user experience.
      </p>
      <h2>2. Information Use</h2>
      <p>
        We may use the information collected from you to provide and improve the
        Service, communicate with you about updates and news, respond to your
        inquiries, and enforce our Terms of Service. We may also use aggregated,
        anonymized data for statistical and analytical purposes.
      </p>
      <h2>3. Information Disclosure</h2>
      <p>
        We may disclose your information to third-party service providers who
        assist us in operating the Service, conducting business, or providing
        services to you. We may also disclose your information to comply with
        legal requirements, protect our rights and property, prevent fraud or
        harm, and in case of a business transfer or merger.
      </p>
      <h2>4. Security</h2>
      <p>
        We take reasonable measures to protect the information collected from
        you against unauthorized access, disclosure, alteration, or destruction.
        However, no method of transmission over the Internet or electronic
        storage is 100% secure, and we cannot guarantee absolute security.
      </p>
      <h2>5. Children&apos;s Privacy</h2>
      <p>
        The Service is not intended for children under the age of 13. We do not
        knowingly collect or solicit personally identifiable information from
        children. If you are a parent or guardian and believe that your child
        has provided us with personal information, please contact us
        immediately.
      </p>
      <h2>6. Consent</h2>
      <p>
        By using the Service, you consent to the collection, use, and disclosure
        of your information as described in this Privacy Policy.
      </p>
      <h2>7. Changes to Privacy Policy</h2>
      <p>
        We reserve the right, at our sole discretion, to modify or update this
        Privacy Policy at any time. We will notify you of any changes by posting
        the updated Privacy Policy on the Service. Your continued use of the
        Service after any such changes constitutes your acceptance of the
        updated Privacy Policy.
      </p>
      <h2>8. Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, please
        contact us at{" "}
        <Anchor href="mailto:forwarding.platf@gmail.com">
          forwarding.platf@gmail.com
        </Anchor>
      </p>
    </Container>
  );
}

Privacy.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps(ctx) {
  return {
    props: {
      metaTitle: "Privacy",
    },
  };
}

import Layout from "@/components/layouts/_layout";
import { Anchor, Container } from "@mantine/core";
import React from "react";

export default function Terms() {
  return (
    <Container>
      <h1>Terms of Service</h1>
      <p>
        Please read these Terms of Service carefully before using the Forwarding
        website operated by Forwarding.
      </p>
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using the Service, you agree to be bound by these Terms
        of Service. If you do not agree to these Terms, you may not use the
        Service.
      </p>
      <h2>2. Intellectual Property</h2>
      <p>
        The Service and its original content, features, and functionality are
        owned by Forwarding and are protected by international copyright,
        trademark, patent, trade secret, and other intellectual property or
        proprietary rights laws.
      </p>
      <h2>3. User Conduct</h2>
      <p>
        You are solely responsible for your conduct while using the Service. You
        agree not to use the Service for any illegal, harmful, or unauthorized
        purposes. You also agree not to engage in any activity that may
        interfere with the normal operation of the Service or harm our users or
        our reputation.
      </p>
      <h2>4. Disclaimer of Warranty</h2>
      <p>
        The Service is provided on an as-is and as-available basis without
        warranties of any kind, whether express or implied, including, but not
        limited to, implied warranties of merchantability, fitness for a
        particular purpose, non-infringement, or course of performance.
      </p>
      <h2>5. Limitation of Liability</h2>
      <p>
        In no event shall Forwarding, its affiliates, officers, directors,
        employees, agents, or licensors be liable for any direct, indirect,
        incidental, special, consequential, or exemplary damages, including, but
        not limited to, damages for loss of profits, goodwill, use, data, or
        other intangible losses, resulting from your use or inability to use the
        Service.
      </p>
      <h2>6. Governing Law</h2>
      <p>
        These Terms of Service shall soon be governed and interpreted in
        accordance with the laws of the state of Vietnam, without regard to its
        conflict of law provisions.
      </p>
      <h2>7. Changes to Terms of Service</h2>
      <p>
        We reserve the right, at our sole discretion, to modify or replace these
        Terms of Service at any time. Your continued use of the Service after
        any such changes constitutes your acceptance of the updated Terms of
        Service.
      </p>
      <h2>8. Contact Us</h2>
      <p>
        If you have any questions or concerns about these Terms of Service,
        please contact us at{" "}
        <Anchor href="mailto:forwarding.platf@gmail.com">
          forwarding.platf@gmail.com
        </Anchor>
      </p>
    </Container>
  );
}

Terms.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps(ctx) {
  return {
    props: {
      metaTitle: "Terms",
    },
  };
}

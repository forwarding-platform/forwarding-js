import Providers from "@/components/Providers";
import { RouterTransition } from "@/components/RouterTransition";
import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Providers pageProps={pageProps}>
        <RouterTransition />
        <Component {...pageProps} />
      </Providers>
    </>
  );
}

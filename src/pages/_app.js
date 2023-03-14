import Providers from "@/components/Providers";
import { RouterTransition } from "@/components/RouterTransition";
import "@/styles/globals.css";
import Head from "next/head";
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
        <div className={font.className}>
          <Component {...pageProps} />
        </div>
      </Providers>
    </>
  );
}

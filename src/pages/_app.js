import Providers from "@/components/app/Providers";
import { RouterTransition } from "@/components/app/RouterTransition";
import TopTopButton from "@/components/common/TopTopButton";
import "@/styles/globals.css";
import { Montserrat } from "next/font/google";
import Head from "next/head";

const font = Montserrat({ subsets: ["latin", "vietnamese"] });

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <title>Forwarding</title>
      </Head>
      <style jsx global>{`
        html {
          font-family: ${font.style.fontFamily};
        }
      `}</style>
      <Providers pageProps={pageProps}>
        <RouterTransition />
        <TopTopButton />
        <div className={`${font.className} scroll-smooth`}>
          {getLayout(<Component {...pageProps} />)}
        </div>
      </Providers>
    </>
  );
}

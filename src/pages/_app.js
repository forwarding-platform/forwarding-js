import Providers from "@/components/Providers";
import { RouterTransition } from "@/components/RouterTransition";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <Providers>
      <RouterTransition />
      <Component {...pageProps} />
    </Providers>
  );
}

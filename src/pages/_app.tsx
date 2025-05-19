import type { AppProps } from "next/app";
import "@/src/styles/global.scss"
import {Header} from "@/src/components/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  )
}

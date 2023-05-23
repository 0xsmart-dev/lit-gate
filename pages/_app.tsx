import React from "react";
import type { AppProps } from "next/app";
import { DAppProvider } from "@usedapp/core";

import { networkConfig } from "../constants/config";
import Layout from "../components/Layout";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <DAppProvider config={networkConfig}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </DAppProvider>
    </React.StrictMode>
  );
}

export default MyApp;

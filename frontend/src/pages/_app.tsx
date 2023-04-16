import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, useMediaQuery } from "@mui/material";
import React from "react";
import { AppProps } from "next/app";
import "@src/styles/handsontableStyles.css";
import Layout from "@src/components/Layout/Layout";
import Head from "next/head";
import { DefaultSeo } from "next-seo";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const darkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: "#ab47bc" },
          secondary: { main: "#90caf9" },
        },
      }),
    [darkMode]
  );
  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
      </Head>
      <DefaultSeo
        titleTemplate="%s | Macroservices"
        defaultTitle="App | Macroservices"
      />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </SessionProvider>
  );
}

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, useMediaQuery } from "@mui/material";
import React from "react";
import { AppProps } from "next/app";
import "@src/styles/handsontableStyles.css";
import Layout from "@src/components/Layout/Layout";

export default function App({ Component, pageProps }: AppProps) {
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

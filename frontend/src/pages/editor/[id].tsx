import React, { useEffect, useState } from "react";
import ExportOptions from "@src/components/exportOptions";
import { Box, CssBaseline, IconButton, useTheme } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import CSVConfiguration from "@src/components/csvConfiguration/CSVConfiguration";
import { NextSeo } from "next-seo";
import { deleteInvoice, loadFile, loadUBL, setUBL } from "@src/persistence";
import { useRouter } from "next/router";

export const getServerSideProps = () => ({ props: {} });

export default function Editor() {
  const router = useRouter();
  const theme = useTheme();

  const id = parseInt(router.query.id as string);

  const [file, setFile] = useState<File>();
  const [loadedXML, setLoadedXML] = useState("");

  const loadCSV = () => {
    const f = loadFile(id);

    if (f !== null) {
      setFile(f);
      return true;
    }
    return false;
  };

  const loadXMLData = () => {
    const ubl = loadUBL(id);

    if (ubl !== null) {
      setLoadedXML(ubl);
      return true;
    }
    return false;
  };

  const goBack = () => {
    if (loadedXML && file) {
      setLoadedXML("");
      setUBL(undefined, id);
    } else if (file) {
      setFile(null);
      deleteInvoice(id);
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    const hasCSV = loadCSV();
    const hasXML = loadXMLData();
    if (!hasCSV && !hasXML) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <>
      <NextSeo title="Editor" />
      <CssBaseline />

      {/*<Box
        position="fixed"
        ml={1}
        mt={1}
        display={loadedXML ? "block" : "none"}
        zIndex={999}
      >
        <IconButton
          sx={{
            backgroundColor: theme.palette.background.default,
            ":hover": {
              backgroundColor: theme.palette.background.default,
            },
          }}
          onClick={goBack}
        >
          <ArrowBack />
        </IconButton>
      </Box>*/}

      {/* Create full height app */}
      {/* https://gist.github.com/dmurawsky/d45f068097d181c733a53687edce1919 */}
      <style global jsx>{`
        html,
        body,
        body > div:first-child,
        div#__next,
        div#__next > div {
          height: 100%;
        }
      `}</style>

      {loadedXML ? (
        <ExportOptions ubl={loadedXML} />
      ) : (
        file && (
          <CSVConfiguration
            id={id}
            file={file}
            setLoadedXML={(loadedXML) => {
              setLoadedXML(loadedXML);
              setUBL(loadedXML, id);
            }}
          ></CSVConfiguration>
        )
      )}
    </>
  );
}

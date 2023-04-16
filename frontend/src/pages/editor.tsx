import React, { useEffect, useState } from "react";
import { uploadFile } from "@src/utils";
import ExportOptions from "@src/components/exportOptions";
import { Box, CssBaseline, IconButton, useTheme } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Upload from "@src/components/Upload";
import CSVConfiguration from "@src/components/csvConfiguration/CSVConfiguration";
import { NextSeo } from "next-seo";
import {
  clearFieldStates,
  clearFile,
  clearInvoiceItemsSelection,
  clearUBL,
  loadFile,
  loadUBL,
  saveFile,
  saveUBL,
} from "@src/persistence";

export default function Editor() {
  const theme = useTheme();

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [file, setFile] = useState<File>();
  const [loadedXML, setLoadedXML] = useState("");

  const handleCSVUpload = async () => {
    try {
      const f = await uploadFile(".csv");

      await saveFile(f);
      setFile(f);
      setUploadSuccess(true);
    } catch (e) {
      if (typeof e === "string") {
        setSnackbarMessage(e);
      } else {
        setSnackbarMessage(e.toString());
      }
    }
  };

  const handleUBLUpload = async () => {
    try {
      const f = await uploadFile(".xml");

      const bytes = await f.arrayBuffer();
      const xml = Buffer.from(bytes).toString();
      setLoadedXML(xml);
      saveUBL(xml);
    } catch (e) {
      if (typeof e === "string") {
        setSnackbarMessage(e);
      } else {
        setSnackbarMessage(e.toString());
      }
    }
  };

  const loadProgress = async () => {
    const f = await loadFile();

    if (f !== null) {
      setFile(f);
      setUploadSuccess(true);
    }
  };

  const loadXMLData = async () => {
    const ubl = await loadUBL();

    if (ubl !== null) {
      setLoadedXML(ubl);
    }
  };

  const goBack = () => {
    if (loadedXML) {
      setLoadedXML("");
      clearUBL();
    } else if (file) {
      setFile(null);
      setUploadSuccess(false);
      clearFieldStates();
      clearInvoiceItemsSelection();
      clearFile();
    }
  };

  useEffect(() => {
    loadProgress();
    loadXMLData();
  }, []);

  return (
    <>
      <NextSeo title="Editor" />
      <CssBaseline />

      <Box
        position="fixed"
        ml={1}
        mt={1}
        display={loadedXML || uploadSuccess ? "block" : "none"}
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
      </Box>

      {loadedXML ? (
        <ExportOptions ubl={loadedXML} />
      ) : uploadSuccess ? (
        <CSVConfiguration
          file={file}
          setLoadedXML={(loadedXML) => {
            setLoadedXML(loadedXML);
            saveUBL(loadedXML);
          }}
        ></CSVConfiguration>
      ) : (
        <Upload
          snackbarMessage={snackbarMessage}
          setSnackbarMessage={setSnackbarMessage}
          handleCSVUpload={handleCSVUpload}
          handleUBLUpload={handleUBLUpload}
        ></Upload>
      )}
    </>
  );
}

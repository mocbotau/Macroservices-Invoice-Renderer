import React, { useEffect, useState } from "react";
import { uploadFile } from "@src/utils";
import ExportOptions from "@src/components/exportOptions";
import { Box, CssBaseline, IconButton, useTheme } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
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
import useWindowDimensions from "./useWindowDimensions";

export default function Editor() {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [file, setFile] = useState<File>();
  const [loadedXML, setLoadedXML] = useState("");

  const { width } = useWindowDimensions();

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
        mt={`${width <= 900 ? (width <= 600 ? "-48px" : "-52px") : "-55px"}`}
        display="block"
        zIndex={999}
      >
        <IconButton onClick={goBack} disabled={!uploadSuccess && !loadedXML}>
          <ArrowBackIosRoundedIcon />
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

import React, { useEffect, useState } from "react";
import { uploadFile } from "@src/utils";
import ExportOptions from "@src/components/exportOptions";
import { CssBaseline } from "@mui/material";
import Upload from "@src/components/Upload";
import CSVConfiguration from "@src/components/csvConfiguration/CSVConfiguration";
import { NextSeo } from "next-seo";
import { loadFile, loadUBL, saveFile, saveUBL } from "@src/persistence";

export default function Editor() {
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

  useEffect(() => {
    loadProgress();
    loadXMLData();
  }, []);

  return (
    <>
      <NextSeo title="Editor" />
      <CssBaseline />

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

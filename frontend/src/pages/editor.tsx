import React, { useState } from "react";
import { uploadFile } from "@src/utils";
import ExportOptions from "@src/components/exportOptions";
import { CssBaseline } from "@mui/material";
import Upload from "@src/components/Upload";
import CSVConfiguration from "@src/components/csvConfiguration/CSVConfiguration";
import { NextSeo } from "next-seo";

export default function Editor() {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [file, setFile] = useState<File>();
  const [loadedXML, setLoadedXML] = useState("");

  const handleCSVUpload = async () => {
    const f = await uploadFile(".csv");

    if (typeof f === "string") {
      setSnackbarMessage(f);
    } else {
      setFile(f);
      setUploadSuccess(true);
    }
  };

  const handleUBLUpload = async () => {
    const f = await uploadFile(".xml");

    if (typeof f === "string") {
      setSnackbarMessage(f);
    } else {
      const bytes = await f.arrayBuffer();
      setLoadedXML(Buffer.from(bytes).toString());
      setUploadSuccess(true);
    }
  };

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
          file={file as File}
          setLoadedXML={setLoadedXML}
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

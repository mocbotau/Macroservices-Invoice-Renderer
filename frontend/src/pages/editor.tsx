import React, { useState } from "react";
import { uploadFile } from "@src/utils";
import ExportOptions from "@src/components/exportOptions";
import { CssBaseline } from "@mui/material";
import Upload from "@src/components/Upload";
import CSVConfiguration from "@src/components/csvConfiguration/CSVConfiguration";

export default function Editor() {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [file, setFile] = useState<File>();
  const [loadedXML, setLoadedXML] = useState("");

  const handleUpload = async () => {
    const f = await uploadFile(".csv");

    if (typeof f === "string") {
      setSnackbarMessage(f);
    } else {
      setFile(f);
      setUploadSuccess(true);
    }
  };

  return (
    <>
      <CssBaseline />

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
          handleUpload={handleUpload}
        ></Upload>
      )}
    </>
  );
}

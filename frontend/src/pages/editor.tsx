import React, { useState } from "react";
import { uploadFile } from "@src/utils";
import Upload from "@src/components/upload";
import CSVConfiguration from "@src/components/csvConfiguration/csvConfiguration";

export default function Editor() {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [file, setFile] = useState<File>();

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
      {uploadSuccess ? (
        <CSVConfiguration file={file as File}></CSVConfiguration>
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

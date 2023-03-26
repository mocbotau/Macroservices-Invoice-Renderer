import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import dynamic from "next/dynamic";
const HotTable = dynamic(
  () =>
    import("@handsontable/react").then((mod) => {
      return mod;
    }),
  { ssr: false }
);
import "handsontable/dist/handsontable.full.min.css";

interface ComponentProps {
  file: File;
}

interface Row extends Record<number, string> {}

export default function CSVConfiguration(props: ComponentProps) {
  const [rows, setRows] = useState<Row[]>([]);
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    Papa.parse(props.file, {
      header: false,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<Row>) => {
        setRows(results.data);
      },
    });
  }, [props.file]);

  return (
    <>
      <HotTable
        data={rows}
        colHeaders={(index) => {
          return "Col " + (index + 1);
        }}
        rowHeaders={true}
        height="auto"
        licenseKey="non-commercial-and-evaluation"
      />
    </>
  );
}

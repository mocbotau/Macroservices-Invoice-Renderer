import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import dynamic from "next/dynamic";
import "handsontable/dist/handsontable.full.min.css";
import { Box, Drawer, useTheme } from "@mui/material";
import CSVConfigurationPane from "./csvConfigurationPane";

const HotTable = dynamic(
  () =>
    import("@handsontable/react").then((mod) => {
      return mod;
    }),
  { ssr: false }
);

interface ComponentProps {
  file: File;
}

type Row = string[];

export default function CSVConfiguration(props: ComponentProps) {
  const theme = useTheme();
  const drawerWidth = theme.spacing(50);

  const [rows, setRows] = useState<Row[]>([]);

  const [selection, setSelection] = useState<string[][]>([]);

  useEffect(() => {
    Papa.parse(props.file, {
      header: false,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<Row>) => {
        setRows(results.data);
      },
    });
  }, [props.file]);

  const onAfterSelectionEnd = (
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
  ) => {
    setSelection(
      rows.slice(startRow, endRow + 1).map((row) => {
        return row.slice(startCol, endCol + 1);
      })
    );
  };

  return (
    <>
      <Box sx={{ display: "block", height: "100vh", width: "100vw" }}>
        <Box
          component="main"
          sx={{
            display: "block",
            height: "100%",
            width: `calc(100% - ${drawerWidth})`,
          }}
        >
          <HotTable
            data={rows}
            colHeaders={(index) => {
              return String.fromCharCode("A".charCodeAt(0) + index);
            }}
            rowHeaders={true}
            height="100%"
            width="100%"
            licenseKey="non-commercial-and-evaluation"
            stretchH="all"
            minRows={200}
            selectionMode="multiple"
            afterSelectionEnd={onAfterSelectionEnd}
            className={"handsontable.dark"}
          />
        </Box>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="right"
        >
          <CSVConfigurationPane selection={selection} />
        </Drawer>
      </Box>
    </>
  );
}

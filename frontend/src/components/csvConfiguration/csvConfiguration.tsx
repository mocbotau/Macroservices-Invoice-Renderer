import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Box, Drawer, useTheme } from "@mui/material";
import CSVConfigurationPane from "./csvConfigurationPane";
import { charFromNumber, checkBoundaries } from "@src/utils";
import { SelectedData } from "@src/interfaces";

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
  const emptySelection = {
    data: [],
    startRow: -1,
    startCol: -1,
    endRow: -1,
    endCol: -1,
  };

  const theme = useTheme();
  const drawerWidth = theme.spacing(50);

  const [rows, setRows] = useState<Row[]>([]);
  const [selection, setSelection] = useState<SelectedData>(emptySelection);
  const [multipleSelection, setMultipleSelection] = useState(false);

  useEffect(() => {
    Papa.parse(props.file, {
      header: false,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<Row>) => {
        setRows(results.data);
      },
    });
  }, [props.file]);

  useEffect(() => {
    setSelection(emptySelection);
  }, [multipleSelection]);

  const onAfterSelectionEnd = (
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
  ) => {
    startRow = checkBoundaries(startRow, rows.length - 1);
    endRow = checkBoundaries(endRow, rows.length - 1);
    startCol = checkBoundaries(startCol, rows[0].length - 1);
    endCol = checkBoundaries(endCol, rows[0].length - 1);

    setSelection({
      data: rows.slice(startRow, endRow + 1).map((row) => {
        return row.slice(startCol, endCol + 1);
      }),
      startRow: startRow,
      startCol: startCol,
      endRow: endRow,
      endCol: endCol,
    });
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
            colHeaders={(index: number) => {
              return charFromNumber(index);
            }}
            editor={false}
            rowHeaders={true}
            height="100%"
            width="100%"
            licenseKey="non-commercial-and-evaluation"
            stretchH="all"
            minRows={200}
            selectionMode={multipleSelection ? "range" : "single"}
            afterSelectionEnd={onAfterSelectionEnd}
            outsideClickDeselects={false}
            className={"handsontable.dark"}
            manualColumnResize={true}
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
          <CSVConfigurationPane
            selection={selection}
            multipleSelection={multipleSelection}
            setMultipleSelection={setMultipleSelection}
          />
        </Drawer>
      </Box>
    </>
  );
}

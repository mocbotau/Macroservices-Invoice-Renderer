import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  Box,
  IconButton,
  Paper,
  SwipeableDrawer,
  useTheme,
} from "@mui/material";
import CSVConfigurationPane from "@src/components/csvConfiguration/CSVConfigurationPane";
import { colFromNumber, checkBoundaries } from "@src/utils";
import { Row, SelectedData, emptySelection } from "@src/interfaces";
import { MIN_ROW_COUNT } from "@src/constants";
import { HotTable } from "./HotTable";
import {
  loadInvoiceItemsSelection,
  saveInvoiceItemsSelection,
} from "@src/persistence";
import useWindowDimensions from "@src/utils/useWindowDimensions";
import { DragHandle } from "@mui/icons-material";
import { MOBILE_WIDTH } from "@src/constants";

interface ComponentProps {
  file: File;
  setLoadedXML: (xml: string) => void;
}

/**
 * The main screen for the CSVConfiguration page, holding the table and
 * configuration pane
 *
 * @param {ComponentProps} props - the required props
 * @returns {JSX.Element} - the returned component
 */
export default function CSVConfiguration(props: ComponentProps): JSX.Element {
  const theme = useTheme();
  const drawerWidth = theme.spacing(50);
  const { width } = useWindowDimensions();

  const [rows, setRows] = useState<Row[]>([]);
  const [selection, setRawSelection] = useState<SelectedData>(emptySelection);
  const [multipleSelection, setMultipleSelection] = useState(false);
  const [showPane, setShowPane] = useState(false);

  const drawerBleeding = 40;

  const loadSavedSelection = async () => {
    const loaded = await loadInvoiceItemsSelection();

    if (loaded !== null) {
      setRawSelection(loaded);
    }
  };

  useEffect(() => {
    loadSavedSelection();
  }, []);

  const setSelection = (selection) => {
    setRawSelection(selection);
    saveInvoiceItemsSelection(selection);
  };

  useEffect(() => {
    Papa.parse(props.file, {
      header: false,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<Row>) => {
        const fileData = results.data;

        const tempArr: string[][] = [
          ...Array(Math.max(fileData.length, MIN_ROW_COUNT)),
        ].map(() => Array(results.data[0].length).fill(""));
        for (const row in fileData) {
          for (const col in fileData[row]) {
            tempArr[row][col] = fileData[row][col];
          }
        }
        setRows(tempArr);
      },
    });
  }, [props.file]);

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

    if (endRow < startRow) [endRow, startRow] = [startRow, endRow];
    if (endCol < startCol) [endCol, startCol] = [startCol, endCol];

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
      <Box
        sx={{
          display: "flex",
          height: "100%",
          width: "100%",
        }}
      >
        <Box
          component="main"
          id={"hot-table-box"}
          sx={{
            display: "flex",
            width: `${
              width <= MOBILE_WIDTH ? "100%" : `calc(100% - ${drawerWidth})`
            }`,
          }}
        >
          <HotTable
            data={rows}
            colHeaders={(index: number) => {
              return colFromNumber(index);
            }}
            editor={false}
            rowHeaders={true}
            height="100%"
            width="100%"
            licenseKey="non-commercial-and-evaluation"
            stretchH="all"
            minRows={MIN_ROW_COUNT}
            selectionMode={multipleSelection ? "range" : "single"}
            afterSelectionEnd={onAfterSelectionEnd}
            outsideClickDeselects={false}
            afterChange={(changes) => {
              // eslint-disable-next-line
              changes?.forEach(([row, col, _, newValue]) => {
                const copy = JSON.parse(JSON.stringify(rows));
                copy[row][col] = newValue;
                setRows(copy);
              });
            }}
          />
          MOBILE_WIDTH
        </Box>
        {width <= MOBILE_WIDTH ? (
          <Box sx={{ justifyContent: "center", alignContent: "center" }}>
            <IconButton
              sx={{
                position: "fixed",
                zIndex: 999,
                rotate: "90deg",
                right: 5,
                top: "50%",
              }}
              onClick={() => setShowPane(true)}
            >
              <DragHandle fontSize="large" />
            </IconButton>
            <SwipeableDrawer
              open={showPane}
              anchor="right"
              onClose={() => setShowPane(false)}
              onOpen={() => setShowPane(true)}
              swipeAreaWidth={drawerBleeding}
              disableSwipeToOpen={false}
              sx={{ zIndex: 1000 }}
            >
              <IconButton
                sx={{
                  position: "fixed",
                  zIndex: 1000,
                  rotate: "90deg",
                  left: -14,
                  top: "50%",
                }}
                onClick={() => setShowPane(false)}
              >
                <DragHandle fontSize="large" />
              </IconButton>
              <CSVConfigurationPane
                selection={selection}
                multipleSelection={multipleSelection}
                setMultipleSelection={setMultipleSelection}
                setLoadedXML={props.setLoadedXML}
              />
            </SwipeableDrawer>
          </Box>
        ) : (
          <Box
            sx={{
              width: drawerWidth,
              overflowY: "scroll",
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                alignContent: "right",
              },
            }}
          >
            <CSVConfigurationPane
              selection={selection}
              multipleSelection={multipleSelection}
              setMultipleSelection={setMultipleSelection}
              setLoadedXML={props.setLoadedXML}
            />
          </Box>
        )}
      </Box>
    </>
  );
}

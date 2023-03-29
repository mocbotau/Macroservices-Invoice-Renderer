import React, { useState, SyntheticEvent, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Container } from "@mui/system";
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  ToggleButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { invoiceOptions } from "./csvConfigurationFields";
import { mapFieldItems } from "./paneComponents/fieldInputs";
import { TabPanel } from "./paneComponents/tabPanel";
import {
  charFromNumber,
  checkRequiredFields,
  convertToCellRefs,
  createTextStateObject,
} from "@src/utils";
import { SelectedData } from "@src/interfaces";
import { Info } from "@mui/icons-material";

interface ComponentProps {
  selection: SelectedData;
  multipleSelection: boolean;
  setMultipleSelection: (value: boolean) => void;
}

export default function CSVConfigurationPane(props: ComponentProps) {
  const { startRow, startCol, endRow, endCol, data } = props.selection;
  const [expanded, setExpanded] = useState<string | false>(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedField, setSelectedField] = useState("");
  const [selectedRange, setSelectedRange] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);
  const [showRequired, setShowRequired] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [hasHeaders, setHasHeaders] = useState(false);

  const initialState = createTextStateObject();
  const [textFieldState, setTextFieldState] = useState(initialState);

  const handleAccordionChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      props.setMultipleSelection(false);
    };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (startRow !== -1 && startCol !== -1 && endRow !== -1 && endCol !== -1) {
      setSelectedRange(convertToCellRefs(startRow, startCol, endRow, endCol));
      setDropdownOptions(
        hasHeaders
          ? data[0]
          : Array.from(
              { length: endCol - startCol + 1 },
              (value, index) => index
            ).map((v, i) => {
              return `Column ${charFromNumber(i + startCol)}`;
            })
      );
    }
  }, [props.multipleSelection, hasHeaders]);

  return (
    <>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" data-testid="missing-fields">
          Please fill in all required fields.
        </Alert>
      </Snackbar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 3,
          height: "100%",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            color="secondary"
            gutterBottom={true}
            sx={{ textEmphasis: 20 }}
          >
            CSV Configurator
          </Typography>
          {invoiceOptions.map((category) => {
            return (
              <Accordion
                expanded={expanded === `${category.id}`}
                onChange={handleAccordionChange(`${category.id}`)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  id={`${category.id}bh-header`}
                >
                  <Typography>{category.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{category.description}</Typography>
                  {category.description && <Divider sx={{ marginY: 2 }} />}
                  {category.id === "invoice_item" ? (
                    <>
                      <Paper
                        component="form"
                        variant="outlined"
                        sx={{
                          marginBottom: 1,
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          placeholder="No range selected"
                          value={
                            data && props.multipleSelection
                              ? convertToCellRefs(
                                  startRow,
                                  startCol,
                                  endRow,
                                  endCol
                                )
                              : selectedRange
                          }
                          disabled
                        />
                        <ToggleButton
                          value="Select Range"
                          selected={props.multipleSelection}
                          onClick={() => {
                            props.setMultipleSelection(
                              !props.multipleSelection
                            );
                          }}
                          color={
                            props.multipleSelection ? "primary" : "standard"
                          }
                          sx={{ width: "45%" }}
                        >
                          {props.multipleSelection ? "Confirm" : "Select Range"}
                        </ToggleButton>
                      </Paper>
                      <Box sx={{ display: "flex" }}>
                        <FormControlLabel
                          control={<Checkbox />}
                          checked={hasHeaders}
                          label="Use Headers"
                          sx={{ display: "flex" }}
                          onChange={() => setHasHeaders(!hasHeaders)}
                          disabled={!props.multipleSelection}
                        />
                        <Tooltip
                          sx={{ display: "flex" }}
                          placement="top"
                          title="Select this if your selection includes headers."
                        >
                          <IconButton>
                            <Info />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Divider sx={{ marginY: 1 }} />
                    </>
                  ) : null}

                  {category.id === "invoice_parties" ? (
                    <Box sx={{ width: "100%" }}>
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                          value={tabValue}
                          onChange={handleTabChange}
                          variant="fullWidth"
                          textColor="secondary"
                          indicatorColor="secondary"
                        >
                          <Tab label="From" />
                          <Tab label="To" />
                        </Tabs>
                      </Box>
                      {["from_", "to_"].map((v, i) => {
                        return (
                          <TabPanel value={tabValue} index={i}>
                            {mapFieldItems(
                              category.items,
                              props.selection,
                              dropdownOptions,
                              selectedField,
                              setSelectedField,
                              textFieldState,
                              setTextFieldState,
                              showRequired,
                              category.id === "invoice_item",
                              v
                            )}
                          </TabPanel>
                        );
                      })}
                    </Box>
                  ) : (
                    mapFieldItems(
                      category.items,
                      props.selection,
                      dropdownOptions,
                      selectedField,
                      setSelectedField,
                      textFieldState,
                      setTextFieldState,
                      showRequired,
                      category.id === "invoice_item"
                    )
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
        <Box sx={{ display: "flex" }}>
          <Button
            variant="outlined"
            sx={{ margin: 1, flexGrow: 1 }}
            onClick={() => {
              setTextFieldState(initialState);
              setSelectedRange("");
              setDropdownOptions([]);
              setShowRequired(false);
            }}
          >
            RESET
          </Button>
          <Button
            variant="contained"
            sx={{ margin: 1, flexGrow: 1 }}
            onClick={() =>
              checkRequiredFields(
                textFieldState,
                setShowRequired,
                setShowSnackbar
              )
            }
          >
            NEXT
          </Button>
        </Box>
      </Box>
    </>
  );
}

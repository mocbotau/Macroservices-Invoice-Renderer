import React, { useState, SyntheticEvent, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box } from "@mui/system";
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputBase,
  Paper,
  Snackbar,
  Switch,
  Tab,
  Tabs,
  ToggleButton,
  Tooltip,
} from "@mui/material";
import { invoiceOptions } from "./csvConfigurationFields";
import { mapFieldItems } from "./paneComponents/fieldInputs";
import { TabPanel } from "./paneComponents/tabPanel";
import {
  colFromNumber,
  convertToCellRefs,
  createTextStateObject,
  getInvoiceItemIDs,
} from "@src/utils";
import { MultiSelectRange, SelectedData, SetStateType } from "@src/interfaces";
import { Info } from "@mui/icons-material";
import lodash from "lodash";
import { handleSubmit } from "@src/utils/handleSubmit";

interface ComponentProps {
  selection: SelectedData;
  multipleSelection: boolean;
  setMultipleSelection: SetStateType<boolean>;
}

const emptySelectedRange: MultiSelectRange = {
  rangeString: "",
  data: [],
};

export default function CSVConfigurationPane(props: ComponentProps) {
  const { startRow, startCol, endRow, endCol, data } = props.selection;
  const [expanded, setExpanded] = useState<string | false>(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedField, setSelectedField] = useState("");
  const [selectedRange, setSelectedRange] = useState(emptySelectedRange);
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);
  const [showRequired, setShowRequired] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [hasHeaders, setHasHeaders] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [deliveryRequired, setDeliveryRequired] = useState(false);

  const initialState = createTextStateObject();
  const [textFieldState, setTextFieldState] = useState(initialState);

  const resettedInvoiceItems = Object.fromEntries(getInvoiceItemIDs());

  const handleAccordionChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      props.setMultipleSelection(false);
    };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (startRow === -1 || startCol === -1 || endRow === -1 || endCol === -1)
      return;
    setSelectedRange({
      rangeString: convertToCellRefs(startRow, startCol, endRow, endCol),
      data: data,
    });
    setDropdownOptions(
      hasHeaders
        ? data[0]
        : Array.from(
            { length: endCol - startCol + 1 },
            (value, index) => index
          ).map((v, i) => {
            return `Column ${colFromNumber(i + startCol)}`;
          })
    );
    // eslint-disable-next-line
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
            color="primary"
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
                key={category.id}
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
                              : selectedRange.rangeString
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
                            setTextFieldState(
                              lodash.merge(textFieldState, resettedInvoiceItems)
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
                          textColor="primary"
                          indicatorColor="primary"
                        >
                          <Tab label="From" />
                          <Tab label="To" />
                        </Tabs>
                      </Box>
                      {["from_", "to_"].map((v, i) => {
                        return (
                          <TabPanel value={tabValue} index={i} key={i}>
                            {mapFieldItems(
                              category.items,
                              props.selection,
                              dropdownOptions,
                              selectedField,
                              setSelectedField,
                              textFieldState,
                              setTextFieldState,
                              showRequired,
                              deliveryRequired,
                              category.id === "invoice_item",
                              props.multipleSelection,
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
                      deliveryRequired,
                      category.id === "invoice_item",
                      props.multipleSelection
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
              setSelectedRange(emptySelectedRange);
              setDropdownOptions([]);
              setDeliveryRequired(false);
              setShowRequired(false);
              setShowLoading(false);
            }}
          >
            RESET
          </Button>
          <LoadingButton
            onClick={() =>
              handleSubmit(
                textFieldState,
                setShowRequired,
                setDeliveryRequired,
                setShowSnackbar,
                setShowLoading,
                props.selection,
                hasHeaders
              )
            }
            loading={showLoading}
            variant="contained"
            sx={{ margin: 1, flexGrow: 1 }}
          >
            <Box>NEXT</Box>
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
}

import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box } from "@mui/system";
import { Button, Divider, Tab, Tabs } from "@mui/material";
import { instructionsForUse, invoiceOptions } from "./csvConfigurationFields";
import { mapFieldItems } from "./paneComponents/FieldInputs";
import { TabPanel } from "./paneComponents/TabPanel";
import {
  colFromNumber,
  convertToCellRefs,
  createTextStateObject,
} from "@src/utils";
import { MultiSelectRange, SelectedData, SetStateType } from "@src/interfaces";
import { handleSubmit } from "@src/utils/handleSubmit";
import { CustomAccordion } from "./paneComponents/Accordion";
import { SelectRangeSection } from "./paneComponents/SelectRange";
import { Snackbar } from "../Snackbar";

interface ComponentProps {
  selection: SelectedData;
  multipleSelection: boolean;
  setMultipleSelection: SetStateType<boolean>;
}

const emptySelectedRange: MultiSelectRange = {
  rangeString: "",
  data: [],
};

/**
 * Renders the configuration page component
 *
 * @param {ComponentProps} props - the required components
 * @returns {JSX.Element} - returns the completed pane component
 */
export default function CSVConfigurationPane(
  props: ComponentProps
): JSX.Element {
  const { selection, multipleSelection, setMultipleSelection } = props;
  const { data, startRow, startCol, endRow, endCol } = selection;

  const [tabValue, setTabValue] = useState(0);
  const [selectedField, setSelectedField] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);
  const [showRequired, setShowRequired] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [hasHeaders, setHasHeaders] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [deliveryRequired, setDeliveryRequired] = useState(false);

  const initialState = createTextStateObject();
  const [textFieldState, setTextFieldState] = useState(initialState);

  const [selectedRange, setSelectedRange] = useState(emptySelectedRange);

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
  }, [multipleSelection, hasHeaders]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Snackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        message="Please fill in all required fields."
      />
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
          <CustomAccordion
            id="instructions"
            title="Instructions"
            setMultipleSelection={props.setMultipleSelection}
          >
            <Typography>{instructionsForUse}</Typography>
          </CustomAccordion>
          {invoiceOptions.map((category) => {
            return (
              <CustomAccordion
                id={category.id}
                title={category.name}
                setMultipleSelection={setMultipleSelection}
                key={category.id}
              >
                <>
                  <Typography>{category.description}</Typography>
                  {category.description && <Divider sx={{ marginY: 2 }} />}
                  {category.id === "invoice_items" ? (
                    <SelectRangeSection
                      selection={selection}
                      multipleSelection={multipleSelection}
                      hasHeaders={hasHeaders}
                      textFieldState={textFieldState}
                      selectedRange={selectedRange}
                      setMultipleSelection={setMultipleSelection}
                      setHasHeaders={setHasHeaders}
                      setTextFieldState={setTextFieldState}
                    />
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
                              selection,
                              dropdownOptions,
                              selectedField,
                              setSelectedField,
                              textFieldState,
                              setTextFieldState,
                              showRequired,
                              deliveryRequired,
                              category.id === "invoice_items",
                              multipleSelection,
                              v
                            )}
                          </TabPanel>
                        );
                      })}
                    </Box>
                  ) : (
                    mapFieldItems(
                      category.items,
                      selection,
                      dropdownOptions,
                      selectedField,
                      setSelectedField,
                      textFieldState,
                      setTextFieldState,
                      showRequired,
                      deliveryRequired,
                      category.id === "invoice_items",
                      multipleSelection
                    )
                  )}
                </>
              </CustomAccordion>
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
                selection,
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

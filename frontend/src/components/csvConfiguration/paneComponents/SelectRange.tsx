import { Info } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputBase,
  Paper,
  ToggleButton,
  Tooltip,
} from "@mui/material";
import { MultiSelectRange, SelectedData, SetStateType } from "@src/interfaces";
import { convertToCellRefs, getInvoiceItemIDs } from "@src/utils";
import lodash from "lodash";

interface ComponentProps {
  selection: SelectedData;
  multipleSelection: boolean;
  hasHeaders: boolean;
  textFieldState: Record<string, string>;
  selectedRange: MultiSelectRange;
  setMultipleSelection: SetStateType<boolean>;
  setHasHeaders: SetStateType<boolean>;
  setTextFieldState: SetStateType<Record<string, string>>;
}

const resetInvoiceItems = Object.fromEntries(getInvoiceItemIDs());

/**
 * Renders the section that contains the select range box and controls
 *
 * @param {ComponentProps} props - object containing props necessary
 * @returns {JSX.Element} - the completed component
 */
export const SelectRangeSection = (props: ComponentProps): JSX.Element => {
  const {
    selection,
    multipleSelection,
    hasHeaders,
    textFieldState,
    selectedRange,
    setMultipleSelection,
    setHasHeaders,
    setTextFieldState,
  } = props;
  const { data, startRow, startCol, endRow, endCol } = selection;

  return (
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
          inputProps={{
            "data-testid": "select_range_box",
          }}
          placeholder="No range selected"
          value={
            data && multipleSelection
              ? convertToCellRefs(startRow, startCol, endRow, endCol)
              : selectedRange.rangeString
          }
          disabled
        />
        <ToggleButton
          value="Select Range"
          selected={multipleSelection}
          onClick={() => {
            setMultipleSelection(!multipleSelection);
            setTextFieldState(lodash.merge(textFieldState, resetInvoiceItems));
          }}
          color={multipleSelection ? "primary" : "standard"}
          sx={{ width: "45%" }}
        >
          {multipleSelection ? "Confirm" : "Select Range"}
        </ToggleButton>
      </Paper>
      <Box sx={{ display: "flex" }}>
        <FormControlLabel
          control={<Checkbox />}
          checked={hasHeaders}
          label="Use Headers"
          sx={{ display: "flex" }}
          onChange={() => setHasHeaders(!hasHeaders)}
          disabled={!multipleSelection}
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
  );
};

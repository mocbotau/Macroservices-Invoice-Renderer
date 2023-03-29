import {
  Grid,
  Box,
  TextField,
  InputAdornment,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { useEffect } from "react";
import { InvoiceOptionItems } from "../csvConfigurationFields";
import TableViewIcon from "@mui/icons-material/TableView";
import { SelectedData } from "@src/interfaces";

type NewTextFieldProps = {
  selection: SelectedData;
  id: string;
  dropdownOptions: string[];
  selectedField: string;
  setSelectedField: (value: string) => void;
  setData: (value: string) => void;
  required: boolean;
  label: string;
  useDropdown: boolean;
  showRequired: boolean;
  textFieldValue: string;
};

function NewTextField(props: NewTextFieldProps) {
  const selectedFirstCell =
    props.selection.data.length !== 0 ? props.selection.data[0][0] : "";

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    props.setData(event.target.value);
  };

  useEffect(() => {
    if (props.selectedField === props.id) {
      props.setData(selectedFirstCell);
      props.setSelectedField("");
    }
  }, [selectedFirstCell]);

  return (
    <TextField
      fullWidth={true}
      value={props.textFieldValue}
      error={
        props.showRequired &&
        props.required &&
        props.textFieldValue.length === 0
      }
      onFocus={() => props.setSelectedField(props.id)}
      onChange={handleTextFieldChange}
      id={props.id}
      required={props.required}
      label={props.label}
      select={props.useDropdown}
      disabled={props.useDropdown && props.dropdownOptions.length === 0}
      InputProps={
        props.useDropdown
          ? {}
          : {
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{
                    opacity: props.selectedField === props.id ? "100%" : "50%",
                  }}
                >
                  <Tooltip title="Select from table">
                    <TableViewIcon />
                  </Tooltip>
                </InputAdornment>
              ),
            }
      }
    >
      {props.dropdownOptions.map((option) => {
        return (
          <MenuItem
            key={option}
            value={option}
            onChange={() => handleTextFieldChange}
          >
            {option}
          </MenuItem>
        );
      })}
    </TextField>
  );
}

export const mapFieldItems = (
  items: InvoiceOptionItems[],
  selection: SelectedData,
  dropdownOptions: string[],
  selectedField: string,
  setSelectedField: (value: string) => void,
  textFieldState: Record<string, string>,
  setTextFieldState: (value: Record<string, string>) => void,
  showRequired: boolean,
  useDropdown: boolean,
  idPrefix: string = ""
): JSX.Element => {
  return (
    <>
      {items.map((item) => {
        return (
          <>
            <Grid container sx={{ marginBottom: "10px" }}>
              <Box
                sx={{
                  borderLeft: 5,
                  paddingLeft: 1,
                  borderColor: item.colour,
                  height: "100%",
                  display: "flex",
                  width: "100%",
                }}
              >
                <NewTextField
                  selection={selection}
                  id={idPrefix + item.id}
                  dropdownOptions={dropdownOptions}
                  selectedField={selectedField}
                  setSelectedField={setSelectedField}
                  setData={(value: string) => {
                    setTextFieldState({
                      ...textFieldState,
                      [idPrefix + item.id]: value,
                    });
                  }}
                  required={item.required}
                  label={item.name}
                  showRequired={showRequired}
                  useDropdown={useDropdown}
                  textFieldValue={textFieldState[idPrefix + item.id]}
                />
              </Box>
            </Grid>
          </>
        );
      })}
    </>
  );
};

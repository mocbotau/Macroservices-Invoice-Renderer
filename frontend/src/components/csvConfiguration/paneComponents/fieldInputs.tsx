import {
  Grid,
  Box,
  TextField,
  InputAdornment,
  Tooltip,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useEffect } from "react";
import { InvoiceOptionItems } from "../csvConfigurationFields";
import TableViewIcon from "@mui/icons-material/TableView";
import { SelectedData, SetStateType } from "@src/interfaces";
import { InfoRounded, WarningRounded } from "@mui/icons-material";

type NewTextFieldProps = {
  selection: SelectedData;
  id: string;
  dropdownOptions: string[];
  selectedField: string;
  setSelectedField: SetStateType<string>;
  setData: SetStateType<string>;
  required: boolean;
  label: string;
  useDropdown: boolean;
  showRequired: boolean;
  deliveryRequired: boolean;
  textFieldValue: string;
  multipleSelect: boolean;
};

function NewTextField(props: NewTextFieldProps) {
  const { setData, setSelectedField, selectedField, id, useDropdown } = props;
  const selectedFirstCell =
    props.selection.data.length !== 0 ? props.selection.data[0][0] : "";

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setData(event.target.value);
  };

  useEffect(() => {
    if (selectedField === id) {
      setData(selectedFirstCell);
      setSelectedField("");
    }

    // eslint-disable-next-line
  }, [selectedFirstCell, id]);

  return (
    <TextField
      fullWidth={true}
      value={!props.multipleSelect ? props.textFieldValue : ""}
      error={
        props.id === "delivery_name"
          ? props.deliveryRequired && props.textFieldValue.length === 0
          : props.showRequired &&
            props.required &&
            props.textFieldValue.length === 0
      }
      onFocus={() => setSelectedField(id)}
      onChange={handleTextFieldChange}
      id={id}
      required={
        props.id === "delivery_name" ? props.deliveryRequired : props.required
      }
      label={props.label}
      select={useDropdown}
      disabled={
        (useDropdown && props.dropdownOptions.length === 0) ||
        props.multipleSelect
      }
      InputProps={
        useDropdown
          ? {}
          : {
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{
                    opacity: selectedField === id ? "100%" : "50%",
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
  setSelectedField: SetStateType<string>,
  textFieldState: Record<string, string>,
  setTextFieldState: SetStateType<Record<string, string>>,
  showRequired: boolean,
  deliveryRequired: boolean,
  useDropdown: boolean,
  multipleSelect: boolean,
  idPrefix = ""
): JSX.Element => {
  return (
    <>
      {items.map((item) => {
        return (
          <Grid container sx={{ marginBottom: "10px" }} key={item.id}>
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
                setData={(value) => {
                  setTextFieldState({
                    ...textFieldState,
                    [idPrefix + item.id]: value as string,
                  });
                }}
                required={item.required}
                label={item.name}
                showRequired={showRequired}
                deliveryRequired={deliveryRequired}
                useDropdown={useDropdown}
                textFieldValue={textFieldState[idPrefix + item.id]}
                multipleSelect={multipleSelect}
              />
              <Tooltip title={item.description}>
                <IconButton>
                  {item.important ? (
                    <WarningRounded color="warning" />
                  ) : (
                    <InfoRounded />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        );
      })}
    </>
  );
};

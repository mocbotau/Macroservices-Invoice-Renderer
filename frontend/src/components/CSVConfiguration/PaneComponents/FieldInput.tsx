import { InputAdornment, MenuItem, TextField, Tooltip } from "@mui/material";
import { SelectedData, SetStateType } from "@src/interfaces";
import { useEffect } from "react";
import TableViewIcon from "@mui/icons-material/TableView";

interface NewTextFieldProps {
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
}

/**
 * Creates a new text field which handles events and different selections
 *
 * @param {NewTextFieldProps} props - the required props
 * @returns {JSX.Element} - the rendered component
 */
export const FieldInput = (props: NewTextFieldProps): JSX.Element => {
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
          ? props.deliveryRequired && props.textFieldValue?.length === 0
          : props.showRequired &&
            props.required &&
            props.textFieldValue?.length === 0
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
      placeholder={`${props.id.includes("date") ? "yyyy-mm-dd" : ""}`}
      inputProps={{ "data-testid": props.id }}
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
};

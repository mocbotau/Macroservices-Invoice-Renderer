import {
  Grid,
  Box,
  Typography,
  TextFieldProps,
  TextField,
  InputAdornment,
  Tooltip,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { InvoiceOptionItems } from "../csvConfigurationFields";
import TableViewIcon from "@mui/icons-material/TableView";

type NewTextFieldProps = TextFieldProps & {
  selection: string;
  id: string;
  selectedField: string;
  setSelectedField: (value: string) => void;
  required: boolean;
  label: string;
  useDropdown: boolean;
};

function newTextField(props: NewTextFieldProps) {
  const [previousValue, setPreviousValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPreviousValue(event.target.value);
  };

  const handleBlur = () => {
    setSelectedValue("");
  };

  useEffect(() => {
    if (props.selectedField === props.id) {
      setSelectedValue(props.selection);
      setPreviousValue(props.selection);
      props.setSelectedField("");
    }
  }, [props.selection]);

  return props.useDropdown ? (
    <Select label={props.label} value={0} fullWidth>
      <MenuItem value={0}>Column A</MenuItem>
    </Select>
  ) : (
    <TextField
      fullWidth={true}
      value={selectedValue || previousValue}
      onFocus={() => props.setSelectedField(props.id)}
      onChange={handleTextFieldChange}
      onBlur={handleBlur}
      id={props.id}
      required={props.required}
      label={props.label}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            sx={{ opacity: props.selectedField === props.id ? "100%" : "50%" }}
          >
            <Tooltip title="Select from table">
              <TableViewIcon />
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  );
}

export const mapFieldItems = (
  items: InvoiceOptionItems[],
  selection: string[][],
  selectedField: string,
  setSelectedField: (value: string) => void,
  useDropdown: boolean,
  idPrefix?: string
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
                {newTextField({
                  selection: selection.length !== 0 ? selection[0][0] : "",
                  id: idPrefix + item.id,
                  selectedField: selectedField,
                  setSelectedField: setSelectedField,
                  required: item.required,
                  label: item.name,
                  useDropdown: useDropdown,
                })}
              </Box>
            </Grid>
          </>
        );
      })}
    </>
  );
};

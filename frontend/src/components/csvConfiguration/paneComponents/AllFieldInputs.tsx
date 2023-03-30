import { Grid, Box, Tooltip, IconButton } from "@mui/material";
import { InvoiceOptionItems } from "../csvConfigurationFields";
import { SelectedData, SetStateType } from "@src/interfaces";
import { InfoRounded, WarningRounded } from "@mui/icons-material";
import { FieldInput } from "./FieldInput";

interface AllFieldInputsProps {
  items: InvoiceOptionItems[];
  selection: SelectedData;
  dropdownOptions: string[];
  selectedField: string;
  setSelectedField: SetStateType<string>;
  textFieldState: Record<string, string>;
  setTextFieldState: SetStateType<Record<string, string>>;
  showRequired: boolean;
  deliveryRequired: boolean;
  useDropdown: boolean;
  multipleSelect: boolean;
  idPrefix?: string;
}

/**
 * Handles mapping all items from configuration fields file into individual components, including
 * the text, description, and the textfield
 *
 * @param {AllFieldInputsProps} props - the required props
 * @returns {JSX.Element} - the completed component
 */
export const AllFieldInputs = (props: AllFieldInputsProps): JSX.Element => {
  const {
    items,
    selection,
    dropdownOptions,
    selectedField,
    setSelectedField,
    textFieldState,
    setTextFieldState,
    showRequired,
    deliveryRequired,
    useDropdown,
    multipleSelect,
  } = props;
  const idPrefix = props.idPrefix === undefined ? "" : props.idPrefix;

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
              <FieldInput
                selection={selection}
                id={idPrefix + item.id}
                dropdownOptions={dropdownOptions}
                selectedField={selectedField}
                setSelectedField={setSelectedField}
                setData={(value: string) => {
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

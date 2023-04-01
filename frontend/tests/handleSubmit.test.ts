import { emptySelection } from "@src/interfaces";
import { createTextStateObject } from "@src/utils";
import { handleSubmit } from "@src/utils/handleSubmit";

let textFieldsState: Record<string, string>;

beforeEach(() => {
  jest.clearAllMocks();
  textFieldsState = createTextStateObject();
});

const setShowRequired = jest.fn();
const setDeliveryRequired = jest.fn();
const setShowSnackbar = jest.fn();
const setShowLoading = jest.fn();
const hasHeaders = false;

const fillSampleData = (): void => {
  textFieldsState["invoice_name"] = "Invoice #1";
  textFieldsState["from_party_name"] = "Sender Company";
  textFieldsState["from_party_abn"] = "123";
  textFieldsState["to_party_name"] = "Receiver Company";
  textFieldsState["to_party_abn"] = "124";
  textFieldsState["item_name"] = "Name";
  textFieldsState["item_quantity"] = "Quantity";
  textFieldsState["item_unit_price"] = "Unit Price";
};

describe("handleSubmit", () => {
  it("should show snackbar when required fields are empty", () => {
    handleSubmit(
      textFieldsState,
      setShowRequired,
      setDeliveryRequired,
      setShowSnackbar,
      setShowLoading,
      emptySelection,
      hasHeaders
    );

    expect(setShowRequired).toHaveBeenCalledWith(true);
    expect(setDeliveryRequired).toHaveBeenCalledWith(false);
    expect(setShowSnackbar).toHaveBeenCalledWith(true);
    expect(setShowLoading).not.toHaveBeenCalled();
  });

  it("should show snackbar when delivery name is required but empty", () => {
    fillSampleData();
    textFieldsState["delivery_address"] = "123 Rainbow Street";

    handleSubmit(
      textFieldsState,
      setShowRequired,
      setDeliveryRequired,
      setShowSnackbar,
      setShowLoading,
      emptySelection,
      hasHeaders
    );

    expect(setShowRequired).toHaveBeenCalledWith(false);
    expect(setDeliveryRequired).toHaveBeenCalledWith(true);
    expect(setShowSnackbar).toHaveBeenCalledWith(true);
    expect(setShowLoading).not.toHaveBeenCalled();
  });

  it("should process data when all required fields are filled, using column headers", () => {
    const selection = {
      data: [
        ["Name", "Quantity", "Price"],
        ["Apple", "1", "$1.00"],
        ["Spinach", "2", "$2.50"],
      ],
      startRow: 1,
      startCol: 2,
      endRow: 3,
      endCol: 4,
    };
    fillSampleData();
    handleSubmit(
      textFieldsState,
      setShowRequired,
      setDeliveryRequired,
      setShowSnackbar,
      setShowLoading,
      selection,
      true
    );

    expect(setShowRequired).not.toHaveBeenCalled();
    expect(setDeliveryRequired).not.toHaveBeenCalled();
    expect(setShowSnackbar).not.toHaveBeenCalled();
    expect(setShowLoading).toHaveBeenCalledWith(true);
  });

  it("should process data when all required fields are filled, not using column headers", () => {
    const selection = {
      data: [
        ["Apple", "1", "$1.00"],
        ["Spinach", "2", "$2.50"],
        ["Orange", "3", "$30.00"],
      ],
      startRow: 1,
      startCol: 2,
      endRow: 3,
      endCol: 4,
    };
    fillSampleData();
    textFieldsState["item_name"] = "Column A";
    textFieldsState["item_quantity"] = "Column B";
    textFieldsState["item_unit_price"] = "Column C";
    handleSubmit(
      textFieldsState,
      setShowRequired,
      setDeliveryRequired,
      setShowSnackbar,
      setShowLoading,
      selection,
      hasHeaders
    );

    expect(setShowRequired).not.toHaveBeenCalled();
    expect(setDeliveryRequired).not.toHaveBeenCalled();
    expect(setShowSnackbar).not.toHaveBeenCalled();
    expect(setShowLoading).toHaveBeenCalledWith(true);
  });
});

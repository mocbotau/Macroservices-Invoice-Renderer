import { render, screen, fireEvent } from "@testing-library/react";
import CSVConfigurationPane from "@src/components/csvConfiguration/CSVConfigurationPane";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

describe("CSVConfigurationPane", () => {
  const props = {
    selection: {
      startRow: 1,
      startCol: 1,
      endRow: 3,
      endCol: 3,
      data: [
        ["Name", "Age", "Gender"],
        ["John Doe", "30", "Male"],
        ["Jane Doe", "28", "Female"],
      ],
    },
    multipleSelection: false,
    setMultipleSelection: jest.fn(),
    hasHeaders: false,
  };

  it("renders the CSV Configurator title", () => {
    render(<CSVConfigurationPane {...props} />);
    const title = screen.getByText(/CSV Configurator/i);
    expect(title).toBeInTheDocument();
  });

  it("renders the Instructions accordion", () => {
    render(<CSVConfigurationPane {...props} />);
    const instructionsAccordion = screen.getByRole("button", {
      name: /Instructions/i,
    });
    expect(instructionsAccordion).toBeInTheDocument();
  });

  it("renders the Invoice Items accordion", () => {
    render(<CSVConfigurationPane {...props} />);
    const invoiceItemsAccordion = screen.getByRole("button", {
      name: /Invoice Items/i,
    });
    expect(invoiceItemsAccordion).toBeInTheDocument();
  });

  it("calls the setMultipleSelection function with false when accordion is expanded", () => {
    const setMultipleSelection = jest.fn();
    render(
      <CSVConfigurationPane
        {...props}
        setMultipleSelection={setMultipleSelection}
      />
    );
    const instructionsAccordion = screen.getByRole("button", {
      name: /Instructions/i,
    });
    fireEvent.click(instructionsAccordion);
    expect(setMultipleSelection).toHaveBeenCalledWith(false);
  });

  it("displays an error message when required fields are missing and form is submitted", () => {
    render(<CSVConfigurationPane {...props} />);
    const submitButton = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(submitButton);
    const errorMessage = screen.getByTestId("error-snackbar");
    expect(errorMessage).toBeInTheDocument();
  });

  it("typing in values into fields should work", () => {
    render(<CSVConfigurationPane {...props} />);
    const invoiceNameField: HTMLInputElement = screen.getByTestId(
      "invoice_name"
    ) as HTMLInputElement;

    fireEvent.change(invoiceNameField as Element, {
      target: { value: "test" },
    });

    expect(invoiceNameField.value).toBe("test");
  });

  it("reset button should clear all fields", async () => {
    render(<CSVConfigurationPane {...props} />);
    const invoiceNameField: HTMLInputElement = screen.getByTestId(
      "invoice_name"
    ) as HTMLInputElement;

    const deliveryNameField: HTMLInputElement = screen.getByTestId(
      "delivery_name"
    ) as HTMLInputElement;

    fireEvent.change(invoiceNameField as Element, {
      target: { value: "test" },
    });
    fireEvent.change(deliveryNameField as Element, {
      target: { value: "test" },
    });

    const resetButton: Element = screen.getByText("RESET");
    await userEvent.click(resetButton);

    expect(invoiceNameField.value).toBe("");
    expect(deliveryNameField.value).toBe("");
  });

  it("submitting successfully", async () => {});
});

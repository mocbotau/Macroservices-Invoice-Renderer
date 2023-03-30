import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import CSVConfiguration from "@src/components/csvConfiguration/csvConfiguration";

describe("CSVConfiguration", () => {
  const file = new File(["col1,col2\n1,2\n3,4"], "test.csv");

  it("renders without crashing", () => {
    render(<CSVConfiguration file={file} />);
  });

  it("displays the correct number of rows and columns", async () => {
    render(<CSVConfiguration file={file} />);
    await screen.findByText("col1");
    expect(screen.getAllByRole("row")).toHaveLength(3);
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
  });

  it("allows selecting a single cell", async () => {
    render(<CSVConfiguration file={file} />);
    const cell = screen.getByRole("gridcell", { name: /1/ });
    fireEvent.click(cell);
    expect(cell).toHaveClass("ht__highlight");
  });
});

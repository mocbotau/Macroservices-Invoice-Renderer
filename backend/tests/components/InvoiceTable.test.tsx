/**
 * @jest-environment jsdom
 */

import "./jest-setup";

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { InvoiceTable } from "@src/react/components/InvoiceTable";

import testObject from "@tests/resources/example1.json";

describe("Invoice table component", () => {
  test("It should contain headings and data items", () => {
    render(<InvoiceTable invoiceLines={testObject.InvoiceLine} />);

    const textFields = [
      "Item ID",
      "Item",
      "Qty.",
      "Unit Price",
      "Subtotal",
      "1",
      "pencils",
      "500",
      "$0.20 AUD",
      "$100.00 AUD",
    ];
    textFields.forEach((text) => expect(screen.getByText(text)).toBeTruthy());
  });
});

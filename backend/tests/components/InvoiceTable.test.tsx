/**
 * @jest-environment jsdom
 */

import "../jest-setup";

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { InvoiceTable } from "@src/react/components/InvoiceTable";

import testObject from "@tests/resources/example1.json";

describe("Invoice table component", () => {
  test("It should contain headings and data items", () => {
    render(
      <InvoiceTable invoiceLines={testObject.InvoiceLine} i18next={undefined} />
    );

    const textFields = [
      "Item ID",
      "Item",
      "Qty", // unstubbed translation configuration for i18n returns the key as the same translation, hence the omission of the '.'
      "Unit Price",
      "Subtotal",
      "1",
      "pencils",
      "500",
      "$0.20",
      "$100.00",
    ];
    textFields.forEach((text) => expect(screen.getByText(text)).toBeTruthy());
  });
});

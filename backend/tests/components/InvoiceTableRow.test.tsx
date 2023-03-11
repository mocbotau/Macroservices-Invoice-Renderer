/**
 * @jest-environment jsdom
 */

import "./jest-setup";

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { InvoiceTableRow } from "@src/react/components/InvoiceTableRow";
import i18next from "@tests/components/i18nTest";

import testObject from "@tests/resources/example1.json";

describe("Invoice table row component", () => {
  test("It should contain the ID, name, quantity, unit and total price of the item", () => {
    const widths = {
      "ID": { width: "20%" },
      "InvoicedQuantity": { width: "20%" },
      "LineExtensionAmount": { width: "20%" },
      "Item": { width: "20%" },
      "Price": { width: "20%" },
    };

    render(
      <InvoiceTableRow
        invoiceLine={testObject.InvoiceLine[0]}
        widths={widths}
        i18next={i18next}
      />
    );

    const textFields = ["1", "pencils", "500", "$0.20 AUD", "$100.00 AUD"];
    textFields.forEach((text) => expect(screen.getByText(text)).toBeTruthy());
  });
});

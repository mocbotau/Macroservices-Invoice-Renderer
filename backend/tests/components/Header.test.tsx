/**
 * @jest-environment jsdom
 */

import "./jest-setup";

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Header } from "@src/react/components/Header";
import testObject from "@tests/resources/example1.json";

describe("Header component", () => {
  test("It should contain both party names", async () => {
    render(
      <Header
        supplierParty={testObject["AccountingSupplierParty"]}
        customerParty={testObject["AccountingCustomerParty"]}
      />
    );

    const textFields = [
      "Ebusiness Software Services Pty Ltd",
      "Awolako Enterprises Pty Ltd",
      "Invoice",
    ];
    textFields.forEach((text) => expect(screen.getByText(text)).toBeTruthy());
  });
});

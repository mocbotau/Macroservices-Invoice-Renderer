/**
 * @jest-environment jsdom
 */

import "./jest-setup";

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Header } from "@src/react/components/Header";
import testObject from "@tests/resources/example1.json";
import i18next from "@tests/components/i18nTest";

describe("Header component", () => {
  test("It should contain both party names", async () => {
    render(
      <Header
        supplierParty={testObject["AccountingSupplierParty"]}
        customerParty={testObject["AccountingCustomerParty"]}
        i18next={i18next}
      />
    );

    const textFields = [
      "Ebusiness Software Services Pty Ltd",
      "Awolako Enterprises Pty Ltd",
      "invoice", // unstubbed translation configuration for i18n returns the key as the same translation, hence the lowercase i
    ];
    textFields.forEach((text) => expect(screen.getByText(text)).toBeTruthy());
  });
});

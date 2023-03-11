/**
 * @jest-environment jsdom
 */

import "../jest-setup";

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Party } from "@src/react/components/Party";
import testObject from "@tests/resources/example1.json";

describe("Party component", () => {
  test("It should contain relevant text fields", () => {
    render(<Party party={testObject["AccountingSupplierParty"]["Party"]} />);

    const textFields = [
      "Ebusiness Software Services Pty Ltd",
      "ABN: 80647710156",
      "100 Business St",
      "Dulwich Hill 2203",
      "Australia",
    ];

    textFields.forEach((text) => expect(screen.getByText(text)).toBeTruthy());
  });
});

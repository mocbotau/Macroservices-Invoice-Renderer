/**
 * @jest-environment jsdom
 */

import "./jest-setup";

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Metadata } from "@src/react/components/Metadata";
import testObject from "@tests/resources/example1.json";

describe("Metadata component", () => {
  test("It should contain invoice ID, issuing date and payment note", async () => {
    render(
      <Metadata
        id={testObject["ID"]}
        issueDate={testObject["IssueDate"]}
        paymentTerms={testObject["PaymentTerms"]}
        note={testObject["Note"]}
      />
    );

    const textFields = ["EBWASP1002", "2022-02-07", "As agreed"];
    textFields.forEach((text) => expect(screen.getByText(text)).toBeTruthy());
  });
});

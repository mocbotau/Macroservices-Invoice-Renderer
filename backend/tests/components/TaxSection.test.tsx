/**
 * @jest-environment jsdom
 */

import "./jest-setup";

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import i18next from "@tests/components/i18nTest";

import testObject from "@tests/resources/example1.json";
import { TaxSection } from "@src/react/components/TaxSection";

describe("Tax section component", () => {
  test("It should list the tax type, taxable subtotal, tax percent, and taxable amount", () => {
    render(<TaxSection taxTotal={testObject.TaxTotal} i18next={i18next} />);

    const textFields = ["GST", "$100.00 AUD", "10%", "$10.00 AUD"];
    textFields.forEach((text) => expect(screen.getByText(text)).toBeTruthy());
  });
});

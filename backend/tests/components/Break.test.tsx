/**
 * @jest-environment jsdom
 */

import "./jest-setup";

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Break } from "@src/react/components/Break";

describe("Break component", () => {
  test("It should exist", () => {
    render(<Break />);
    expect(document.body.children.item(0)).toBeTruthy();
  });
});

import i18next from "i18next";
import React from "react";
import { TextDecoder, TextEncoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock("@react-pdf/renderer", () => ({
  StyleSheet: { create: () => ({}) },
  Text: ({ children }) => <p>{children}</p>,
  View: ({ children }) => <div>{children}</div>,
  Font: { register: () => null },
}));

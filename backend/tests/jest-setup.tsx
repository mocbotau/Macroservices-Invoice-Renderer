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

jest.mock("@src/i18next", () => ({ changeLanguage: () => undefined }));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

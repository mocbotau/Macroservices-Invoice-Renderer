import React from "react";
import { TextDecoder, TextEncoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock("@react-pdf/renderer", () => ({
  Document: ({ children }) => <div>{children}</div>,
  Image: () => <div>Image</div>,
  Page: ({ children }) => <div>{children}</div>,
  PDFViewer: jest.fn(() => null),
  StyleSheet: { create: () => ({}) },
  Text: ({ children }) => <p>{children}</p>,
  View: ({ children }) => <div>{children}</div>,
}));

import { Response } from "express";
import React from "react";
import { TextDecoder, TextEncoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock("@react-pdf/renderer", () => ({
  renderToStream: async () => ({
    pipe: (res: Response) => {
      res.send("pretend this is a pdf");
    },
  }),
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

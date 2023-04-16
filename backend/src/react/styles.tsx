import { StyleSheet, Font } from "@react-pdf/renderer";
import "@react-pdf/font";
import React from "react";

import { PAGE_SIZES } from "@src/constants";

Font.register({
  family: "arial-regular",
  src: "fonts/Arial-Unicode.ttf",
});

Font.register({
  family: "arial-bold",
  src: "fonts/Arial-Unicode-Bold.ttf",
});

Font.register({
  family: "arial-oblique",
  src: "fonts/Arial-Unicode-Italic.ttf",
});

export enum Detail {
  SUMMARY,
  DEFAULT,
  DETAILED,
}

const defaultStyle = {
  meta: {
    pageSize: "A4P",
    detail: Detail.DEFAULT,
  },
  page: {
    padding: PAGE_SIZES.A4P.MARGIN,
    fontSize: 12,
    fontFamily: "arial-regular",
  },
  title: {
    fontFamily: "arial-bold",
    fontSize: 24,
  },
  h1: {
    fontSize: 18,
    marginTop: 12,
  },
  bold: {
    fontFamily: "arial-bold",
  },
  oblique: {
    fontFamily: "arial-oblique",
  },
  big: {
    fontSize: 14,
    marginTop: 6,
  },
  horizontalFlex: {
    flexDirection: "row",
  },
  flexbox: {
    display: "flex",
  },
  metadata: {
    width: "33.33%",
    paddingVertical: 4,
  },
  tableWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: "black",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    borderTopWidth: 2,
    borderColor: "black",
    width: "100%",
  },
  col: {
    padding: 4,
    display: "flex",
    borderLeftWidth: 2,
    borderColor: "black",
  },
  borderless: {
    borderWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  totalTable: {
    width: PAGE_SIZES.A4P.WIDTH / 2 - PAGE_SIZES.A4P.MARGIN,
    marginLeft:
      PAGE_SIZES.A4P.WIDTH - PAGE_SIZES.A4P.WIDTH / 2 - PAGE_SIZES.A4P.MARGIN,
  },
  icon: {
    height: "64px",
    position: "absolute",
    top: 8,
    right: 0,
  },
  iconHtml: {
    height: "64px",
    position: "absolute",
    top: PAGE_SIZES.A4P.MARGIN,
    right: PAGE_SIZES.A4P.MARGIN,
  },
};

export const styleContext = React.createContext(0);

export const extraStyles: object[] = [
  {
    // Coloured
    meta: {
      pageSize: "A4P",
    },
    title: {
      color: "#0d2363",
    },
    h1: {
      color: "#2a4cb0",
    },
    bold: {
      color: "#4a74f0",
    },
    break: {
      borderColor: "#0d2363",
    },
    tableWrapper: {
      borderColor: "#0d2363",
    },
    row: {
      borderColor: "#0d2363",
    },
    col: {
      borderColor: "#0d2363",
    },
  },
  {
    // Landscape
    meta: {
      pageSize: "A4L",
    },
  },
  {
    // Detailed
    meta: {
      pageSize: "A4L",
      detail: Detail.DETAILED,
    },
  },
  {
    // Summary
    meta: {
      pageSize: "A4P",
      detail: Detail.SUMMARY,
    },
  },
  {
    // Default
    meta: {
      pageSize: "A4P",
    },
  },
];

extraStyles.forEach((x) => {
  const pageSize = x["meta"].pageSize;

  if (pageSize) {
    if (!x["page"]) x["page"] = {};
    if (!x["tableWrapper"]) x["tableWrapper"] = {};
    if (!x["totalTable"]) x["totalTable"] = {};

    x["tableWrapper"].width = PAGE_SIZES[pageSize].INNER_WIDTH;
    x["totalTable"].width =
      PAGE_SIZES[pageSize].WIDTH / 2 - PAGE_SIZES[pageSize].MARGIN;
    x["totalTable"].marginLeft =
      PAGE_SIZES[pageSize].WIDTH -
      PAGE_SIZES[pageSize].WIDTH / 2 -
      PAGE_SIZES[pageSize].MARGIN;
  }

  for (const styleObj in defaultStyle) {
    if (x[styleObj] === undefined) x[styleObj] = {};
    for (const styleProp in defaultStyle[styleObj]) {
      if (x[styleObj][styleProp] === undefined)
        x[styleObj][styleProp] = defaultStyle[styleObj][styleProp];
    }
  }
});

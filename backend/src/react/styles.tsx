import { StyleSheet } from "@react-pdf/renderer";
import React from "react";

import { PAGE_SIZES } from "@src/constants";

export enum StyleContexts {
  Default,
  Landscape,
  Detailed,
  Summary,
  NoColourSummary,
}

export const styleContext = React.createContext("default");

export const extraStyles: object[] = [
  {
    meta: {
      pageSize: "A4P",
    },
  },
  {
    meta: {
      pageSize: "A4L",
    },
  },
  {
    meta: {
      pageSize: "A4L",
    },
  },
  {
    meta: {
      pageSize: "A4P",
    },
  },
  {
    meta: {
      pageSize: "A4P",
    },
  },
];
extraStyles.forEach((x) => {
  const pageSize = x["meta"].pageSize;

  if (pageSize) {
    x["page"].margin = PAGE_SIZES[pageSize].MARGIN;
    x["tableWrapper"].width = PAGE_SIZES[pageSize].INNER_WIDTH;
    x["totalTable"].width =
      PAGE_SIZES[pageSize].WIDTH / 2 - PAGE_SIZES[pageSize].MARGIN;
    x["totalTable"].marginLeft =
      PAGE_SIZES[pageSize].WIDTH -
      PAGE_SIZES[pageSize].WIDTH / 2 -
      PAGE_SIZES[pageSize].MARGIN;
  }
});

export const defaultStyles = StyleSheet.create({
  page: {
    margin: PAGE_SIZES.A4P.MARGIN,
    fontFamily: "Helvetica",
    fontSize: 14,
  },
  section: {
    padding: 8,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  oblique: {
    fontFamily: "Helvetica-Oblique",
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 48,
  },
  h1: {
    fontSize: 24,
    marginTop: 12,
  },
  big: {
    fontSize: 18,
    marginTop: 6,
  },
  horizontalFlex: {
    flexDirection: "row",
  },
  flexbox: {
    flex: 1,
  },
  tableWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: PAGE_SIZES.A4P.INNER_WIDTH,
    marginTop: 8,
    borderWidth: 2,
    borderColor: "black",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    borderTop: "solid",
    borderTopWidth: 2,
    borderColor: "black",
    width: "100%",
  },
  col: {
    padding: 8,
    display: "flex",
    borderLeft: "solid",
    borderLeftWidth: 2,
    borderColor: "black",
  },
  borderless: {
    padding: 8,
    borderWidth: 0,
    display: "flex",
  },
  totalTable: {
    width: PAGE_SIZES.A4P.WIDTH / 2 - PAGE_SIZES.A4P.MARGIN,
    marginLeft:
      PAGE_SIZES.A4P.WIDTH - PAGE_SIZES.A4P.WIDTH / 2 - PAGE_SIZES.A4P.MARGIN,
  },
});

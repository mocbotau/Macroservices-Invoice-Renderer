import { StyleSheet } from "@react-pdf/renderer";

import { INNER_WIDTH, PAGE_MARGIN, PAGE_WIDTH } from "@src/constants";

export const styles = StyleSheet.create({
  page: {
    margin: PAGE_MARGIN,
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
    width: INNER_WIDTH,
    marginTop: 8,
    borderWidth: 2,
    borderColor: "black",
  },
  tableWrapper_borderless: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: INNER_WIDTH,
    marginTop: 8,
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
  row_borderless: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    width: "100%",
  },
  col: {
    padding: 8,
    display: "flex",
    borderLeft: "solid",
    borderLeftWidth: 2,
    borderColor: "black",
  },
  col_borderless: {
    padding: 8,
    display: "flex",
  },
  totalTable: {
    width: PAGE_WIDTH / 2 - PAGE_MARGIN,
    marginLeft: PAGE_WIDTH - PAGE_WIDTH / 2 - PAGE_MARGIN,
  },
});

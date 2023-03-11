import { StyleSheet, Font } from "@react-pdf/renderer";
import "@react-pdf/font";

import { INNER_WIDTH, PAGE_MARGIN, PAGE_WIDTH } from "@src/constants";

Font.register({
  family: "arial-regular",
  src: "fonts/Arial-Unicode.ttf",
});

Font.register({
  family: "arial-bold",
  src: "fonts/Arial-Unicode-Bold.ttf",
});

Font.register({
  family: "arial",
  src: "fonts/Arial-Unicode-Italic.ttf",
});

export const styles = StyleSheet.create({
  page: {
    margin: PAGE_MARGIN,
    fontSize: 14,
    fontFamily: "arial-regular",
  },
  section: {
    padding: 8,
  },
  title: {
    fontSize: 48,
  },
  h1: {
    fontSize: 24,
    marginTop: 12,
  },
  bold: {
    fontFamily: "arial-bold",
  },
  oblique: {
    fontFamily: "arial-oblique",
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

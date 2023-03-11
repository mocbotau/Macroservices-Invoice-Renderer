import { StyleSheet, Font } from "@react-pdf/renderer";

import { INNER_WIDTH, PAGE_MARGIN, PAGE_WIDTH } from "@src/constants";

Font.register({
  family: "Noto Sans SC",
  src: "fonts/NotoSansSC-Regular.otf",
});

Font.register({
  family: "Noto Sans SC Bold",
  src: "fonts/NotoSansSC-Bold.otf",
});

Font.register({
  family: "Noto Sans SC Light",
  src: "fonts/NotoSansSC-Light.otf",
});

Font.register({
  family: "Noto Sans KR",
  src: "fonts/NotoSansKR-Regular.otf",
});

Font.register({
  family: "Noto Sans KR Bold",
  src: "fonts/NotoSansKR-Bold.otf",
});

Font.register({
  family: "Noto Sans KR Light",
  src: "fonts/NotoSansKR-Light.otf",
});

Font.register({
  family: "Noto Sans JP",
  src: "fonts/NotoSansJP-Regular.otf",
});

Font.register({
  family: "Noto Sans JP Bold",
  src: "fonts/NotoSansJP-Bold.otf",
});

Font.register({
  family: "Noto Sans JP Light",
  src: "fonts/NotoSansJP-Light.otf",
});

export const styles = StyleSheet.create({
  page: {
    margin: PAGE_MARGIN,
    fontSize: 14,
  },
  section: {
    padding: 8,
  },
  other_bold: {
    fontFamily: "Noto Sans SC Bold",
  },
  other_light: {
    fontFamily: "Noto Sans SC Light",
  },
  other_regular: {
    fontFamily: "Noto Sans SC",
  },
  ko_bold: {
    fontFamily: "Noto Sans KR Bold",
  },
  ko_light: {
    fontFamily: "Noto Sans KR Light",
  },
  ko_regular: {
    fontFamily: "Noto Sans KR",
  },
  ja_bold: {
    fontFamily: "Noto Sans JP Bold",
  },
  ja_light: {
    fontFamily: "Noto Sans JP Light",
  },
  ja_regular: {
    fontFamily: "Noto Sans JP",
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

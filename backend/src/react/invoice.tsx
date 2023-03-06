import React from "react";
import ReactPDF, {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import { RenderArgs } from "@src/interfaces";
import { InvalidLanguage, InvalidStyle, InvalidUBL } from "@src/error";

const MAX_STYLES = 5;

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const Invoice = () => (
  <Document>
    <Page size="A4">
      <View style={styles.section}>
        <Text>Hello World!</Text>
      </View>
    </Page>
  </Document>
);

export default async function renderInvoiceToPDF(args: RenderArgs) {
  if (!args) {
    throw new InvalidUBL({ message: "No UBL file was provided." });
  }
  if (!args.ubl) {
    throw new InvalidUBL({ message: "No UBL file was provided." });
  } else if (!args.language || !["en", "cn"].includes(args.language)) {
    throw new InvalidLanguage();
  } else if (
    args.style === undefined ||
    args.style < 0 ||
    args.style >= MAX_STYLES
  ) {
    // assuming style numbers from 0-4
    throw new InvalidStyle();
  }
  return await ReactPDF.renderToStream(<Invoice />);
}

import React from "react";
import ReactPDF, {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

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

export default async function renderInvoiceToPDF() {
  // TODO: make function take arguments to render invoice with
  return await ReactPDF.renderToStream(<Invoice />);
}

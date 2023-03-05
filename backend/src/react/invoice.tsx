import React from "react";
import ReactPDF, { Page, Text, View, Document } from "@react-pdf/renderer";

import { Party } from "./components/Party";
import { styles } from "./styles";
import { JSONValue } from "@src/interfaces";
import { Header } from "./components/Header";
import { Metadata } from "./components/Metadata";

const Invoice = (props: { ubl: JSONValue }) => {
  const ubl = props.ubl;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Header
            supplierParty={ubl["AccountingSupplierParty"]}
            customerParty={ubl["AccountingCustomerParty"]}
          />
          <Metadata
            id={ubl["ID"]}
            issueDate={ubl["IssueDate"]}
            paymentTerms={ubl["PaymentTerms"]}
          />
        </View>
      </Page>
    </Document>
  );
};

export default async function renderInvoiceToPDF(ubl: JSONValue) {
  return await ReactPDF.renderToStream(<Invoice ubl={ubl} />);
}

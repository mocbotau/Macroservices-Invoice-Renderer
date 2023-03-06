import React from "react";
import ReactPDF, { Page, Text, View, Document } from "@react-pdf/renderer";

import { Party } from "./components/Party";
import { styles } from "./styles";
import { JSONValue } from "@src/interfaces";
import { Header } from "./components/Header";
import { Metadata } from "./components/Metadata";
import { Break } from "./components/Break";
import { InvoiceTable } from "./components/InvoiceTable";
import { TaxSection } from "./components/TaxSection";
import { MonetaryTotal } from "./components/MonetaryTotal";

const Invoice = (props: { ubl: JSONValue }) => {
  const ubl = props.ubl;

  return (
    <Document>
      <Page size="A4">
        <View style={styles.page}>
          <Header
            supplierParty={ubl["AccountingSupplierParty"]}
            customerParty={ubl["AccountingCustomerParty"]}
          />
          <Break height={32} solid />
          <Metadata
            id={ubl["ID"]}
            issueDate={ubl["IssueDate"]}
            paymentTerms={ubl["PaymentTerms"]}
            note={ubl["Note"]}
          />
          <Break height={32} solid />
          <InvoiceTable invoiceLines={ubl["InvoiceLine"]} />
          <Break height={8} />
          <TaxSection taxTotal={ubl["TaxTotal"]} />
          <Break height={8} />
          <MonetaryTotal legalMonetaryTotal={ubl["LegalMonetaryTotal"]} />
        </View>
      </Page>
    </Document>
  );
};

export default async function renderInvoiceToPDF(ubl: JSONValue) {
  return await ReactPDF.renderToStream(<Invoice ubl={ubl} />);
}

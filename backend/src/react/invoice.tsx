import React, { Suspense } from "react";
import ReactPDF, { Page, View, Document } from "@react-pdf/renderer";
import { RenderArgs } from "@src/interfaces";
import { InvalidLanguage, InvalidStyle, InvalidUBL } from "@src/error";

import { styles } from "./styles";
import { JSONValue } from "@src/interfaces";
import { Header } from "./components/Header";
import { Metadata } from "./components/Metadata";
import { Break } from "./components/Break";
import { InvoiceTable } from "./components/InvoiceTable";
import { TaxSection } from "./components/TaxSection";
import { MonetaryTotal } from "./components/MonetaryTotal";
import { ublToJSON } from "@src/util";
import { MAX_STYLES, SUPPORTED_LANGUAGES } from "@src/constants";
import "@src/i18n.ts";
import i18next from "i18next";

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

export default async function generateInvoice(args: RenderArgs) {
  if (!args || !args.ubl) {
    throw new InvalidUBL({ message: "No UBL file was provided." });
  } else if (!args.language || !SUPPORTED_LANGUAGES.includes(args.language)) {
    throw new InvalidLanguage();
  } else if (
    args.style === undefined ||
    args.style < 0 ||
    args.style >= MAX_STYLES
  ) {
    // assuming style numbers from 0-4
    throw new InvalidStyle();
  }
  await i18next.changeLanguage(args.language);
  return await ReactPDF.renderToStream(
    <Suspense fallback="loading">
      <Invoice ubl={ublToJSON(args.ubl)} />
    </Suspense>
  );
}

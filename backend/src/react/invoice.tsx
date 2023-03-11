import React, { Suspense } from "react";
import ReactPDF from "@react-pdf/renderer";
import { RenderArgs } from "@src/interfaces";
import { InvalidLanguage, InvalidStyle, InvalidUBL } from "@src/error";
import ReactDOM from "react-dom/server";

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
import i18next from "@src/i18next";

import {
  renderingContext,
  RenderingContexts,
} from "./components/base/renderingContext";
import Document from "./components/base/Document";
import Page from "./components/base/Page";
import View from "./components/base/View";

const Invoice = (props: {
  ubl: JSONValue;
  renderingContext: RenderingContexts;
}) => {
  const ubl = props.ubl;

  return (
    <renderingContext.Provider value={props.renderingContext}>
      <Document>
        <Page size="A4">
          <View style={styles.page}>
            <Header
              supplierParty={ubl["AccountingSupplierParty"]}
              customerParty={ubl["AccountingCustomerParty"]}
              i18next={i18next}
            />
            <Break height={32} solid />
            <Metadata
              id={ubl["ID"]}
              issueDate={ubl["IssueDate"]}
              paymentTerms={ubl["PaymentTerms"]}
              note={ubl["Note"]}
              i18next={i18next}
            />
            <Break height={32} solid />
            <InvoiceTable invoiceLines={ubl["InvoiceLine"]} i18next={i18next} />
            <Break height={8} />
            <TaxSection taxTotal={ubl["TaxTotal"]} i18next={i18next} />
            <Break height={8} />
            <MonetaryTotal
              legalMonetaryTotal={ubl["LegalMonetaryTotal"]}
              i18next={i18next}
            />
          </View>
        </Page>
      </Document>
    </renderingContext.Provider>
  );
};

async function createInvoiceComponent(
  args: RenderArgs,
  renderingContext: RenderingContexts
) {
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

  return (
    <Suspense fallback="loading">
      <Invoice ubl={ublToJSON(args.ubl)} renderingContext={renderingContext} />
    </Suspense>
  );
}

export async function generateInvoicePDF(args: RenderArgs) {
  return await ReactPDF.renderToStream(
    await createInvoiceComponent(args, RenderingContexts.Pdf)
  );
}

export async function generateInvoiceHTML(
  args: RenderArgs
): Promise<ReactDOM.PipeableStream> {
  const invoiceComponent = await createInvoiceComponent(
    args,
    RenderingContexts.Html
  );

  return new Promise((res) => {
    const stream = ReactDOM.renderToPipeableStream(invoiceComponent, {
      onShellReady() {
        res(stream);
      },
    });
  });
}

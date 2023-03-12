import React, { Suspense, useContext } from "react";
import ReactPDF from "@react-pdf/renderer";
import { RenderArgs } from "@src/interfaces";
import { InvalidLanguage, InvalidStyle, InvalidUBL } from "@src/error";
import ReactDOM from "react-dom/server";

import { Detail, extraStyles, styleContext } from "./styles";
import { JSONValue } from "@src/interfaces";
import { Header } from "./components/Header";
import { Metadata } from "./components/Metadata";
import { Break } from "./components/Break";
import { InvoiceTable } from "./components/InvoiceTable";
import { TaxSection } from "./components/TaxSection";
import { MonetaryTotal } from "./components/MonetaryTotal";
import { ublToJSON } from "@src/util";
import { MAX_STYLES, SUPPORTED_LANGUAGES, PAGE_SIZES } from "@src/constants";
import i18next from "@src/i18next";

import {
  renderingContext,
  RenderingContexts,
} from "./components/base/renderingContext";
import Document from "./components/base/Document";
import Page from "./components/base/Page";
import View from "./components/base/View";
import { Show } from "./components/Show";

const Invoice = (props: {
  ubl: JSONValue;
  renderingContext: RenderingContexts;
  styleContext: number;
}) => {
  const userStyle = extraStyles[props.styleContext];
  const ubl = props.ubl;
  return (
    <renderingContext.Provider value={props.renderingContext}>
      <styleContext.Provider value={props.styleContext}>
        <Document>
          <Page
            size={[
              PAGE_SIZES[extraStyles[props.styleContext]["meta"].pageSize]
                .WIDTH,
              PAGE_SIZES[extraStyles[props.styleContext]["meta"].pageSize]
                .HEIGHT,
            ]}
          >
            <View style={userStyle["page"]}>
              <Header
                supplierParty={ubl["AccountingSupplierParty"]}
                customerParty={ubl["AccountingCustomerParty"]}
                i18next={i18next}
              />
              <Show min={Detail.DEFAULT}>
                <Break height={32} solid />
              </Show>
              <Show max={Detail.SUMMARY}>
                <Break height={8} />
              </Show>
              <Metadata
                id={ubl["ID"]}
                invoicePeriod={ubl["InvoicePeriod"]}
                issueDate={ubl["IssueDate"]}
                dueDate={ubl["DueDate"]}
                paymentTerms={ubl["PaymentTerms"]}
                accountingCost={ubl["AccountingCost"]}
                note={ubl["Note"]}
                delivery={ubl["Delivery"]}
                i18next={i18next}
              />
              <Break height={16} />
              <Break height={8} solid />
              <InvoiceTable
                invoiceLines={ubl["InvoiceLine"]}
                i18next={i18next}
              />
              <Show min={Detail.DEFAULT}>
                <Break height={8} />
                <TaxSection taxTotal={ubl["TaxTotal"]} i18next={i18next} />
              </Show>
              <Break height={8} />
              <MonetaryTotal
                legalMonetaryTotal={ubl["LegalMonetaryTotal"]}
                i18next={i18next}
              />
            </View>
          </Page>
        </Document>
      </styleContext.Provider>
    </renderingContext.Provider>
  );
};

async function createInvoiceComponent(
  args: RenderArgs,
  renderingContext: RenderingContexts,
  styleId: number
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
      <Invoice
        ubl={ublToJSON(args.ubl)}
        renderingContext={renderingContext}
        styleContext={styleId}
      />
    </Suspense>
  );
}

export async function generateInvoicePDF(args: RenderArgs) {
  return await ReactPDF.renderToStream(
    await createInvoiceComponent(args, RenderingContexts.Pdf, args.style)
  );
}

export async function generateInvoiceHTML(
  args: RenderArgs
): Promise<ReactDOM.PipeableStream> {
  const invoiceComponent = await createInvoiceComponent(
    args,
    RenderingContexts.Html,
    args.style
  );

  return new Promise((res) => {
    const stream = ReactDOM.renderToPipeableStream(invoiceComponent, {
      onShellReady() {
        res(stream);
      },
    });
  });
}

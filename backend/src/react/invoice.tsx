import React, { useContext } from "react";
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
import { MAX_STYLES, PAGE_SIZES } from "@src/constants";

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
              />
              <Show min={Detail.DEFAULT}>
                <Break height={32} solid />
              </Show>
              <Show max={Detail.SUMMARY}>
                <Break height={8} />
              </Show>
              <Metadata
                id={ubl["ID"]}
                issueDate={ubl["IssueDate"]}
                paymentTerms={ubl["PaymentTerms"]}
                note={ubl["Note"]}
              />
              <Break height={16} />
              <Break height={8} solid />
              <InvoiceTable invoiceLines={ubl["InvoiceLine"]} />
              <Show min={Detail.DEFAULT}>
                <Break height={8} />
                <TaxSection taxTotal={ubl["TaxTotal"]} />
              </Show>
              <Break height={8} />
              <MonetaryTotal legalMonetaryTotal={ubl["LegalMonetaryTotal"]} />
            </View>
          </Page>
        </Document>
      </styleContext.Provider>
    </renderingContext.Provider>
  );
};

function createInvoiceComponent(
  args: RenderArgs,
  renderingContext: RenderingContexts,
  styleId: number
) {
  if (!args || !args.ubl) {
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

  return (
    <Invoice
      ubl={ublToJSON(args.ubl)}
      renderingContext={renderingContext}
      styleContext={styleId}
    />
  );
}

export async function generateInvoicePDF(args: RenderArgs) {
  return await ReactPDF.renderToStream(
    createInvoiceComponent(args, RenderingContexts.Pdf, args.style)
  );
}

export async function generateInvoiceHTML(
  args: RenderArgs
): Promise<ReactDOM.PipeableStream> {
  const invoiceComponent = createInvoiceComponent(
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

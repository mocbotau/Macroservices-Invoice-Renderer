import React, { Suspense } from "react";
import ReactPDF from "@react-pdf/renderer";
import { RenderArgs, RouteRenderArgs } from "@src/interfaces";
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
import {
  MAX_STYLES,
  SUPPORTED_LANGUAGES,
  PAGE_SIZES,
  REQUIRED_FIELDS,
} from "@src/constants";
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

  const missingComponents: string[] = [];

  REQUIRED_FIELDS.forEach((key: string) => {
    if (!ubl[key]) {
      missingComponents.push(key);
    }
  });

  if (missingComponents.length !== 0) {
    throw new InvalidUBL({
      message: `The provided UBL is missing some mandatory components: ${missingComponents
        .join(", ")
        .replace(/,\s*$/, "")}`,
    });
  }
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
            style={userStyle["page"]}
          >
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
            <InvoiceTable invoiceLines={ubl["InvoiceLine"]} i18next={i18next} />
            <Show min={Detail.DEFAULT}>
              <Break height={8} />
              <TaxSection taxTotal={ubl["TaxTotal"]} i18next={i18next} />
            </Show>
            <Break height={8} />
            <MonetaryTotal
              legalMonetaryTotal={ubl["LegalMonetaryTotal"]}
              i18next={i18next}
            />
          </Page>
        </Document>
      </styleContext.Provider>
    </renderingContext.Provider>
  );
};

/**
 * Creates an Invoice component using react-pdf
 * @param {RenderArgs} args - an object containing language, a styleID and the UBL string
 * @param {RenderingContexts} renderingContext - the rendering context
 * @returns
 */
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
    isNaN(args.style) ||
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
        styleContext={args.style}
      />
    </Suspense>
  );
}

/**
 * Creates a PDF invoice using react-pdf
 * @param {RouteRenderArgs} args - an object containing language, a styleID and the UBL string
 * @returns {Promise<NodeJS.ReadableStream>} - The PDF file stream
 */
export async function generateInvoicePDF(args: RouteRenderArgs) {
  return await ReactPDF.renderToStream(
    await createInvoiceComponent(
      {
        ubl: args.ubl as string,
        style: parseInt(args.style),
        language: args.language as string,
      },
      RenderingContexts.Pdf
    )
  );
}

/**
 * Creates a HTML invoice using react-pdf
 * @param {RouteRenderArgs} args - an object containing language, a styleID and the UBL string
 * @returns {Promise<ReactDOM.PipeableStream>} - The PDF file stream
 */
export async function generateInvoiceHTML(
  args: RouteRenderArgs
): Promise<ReactDOM.PipeableStream> {
  const invoiceComponent = await createInvoiceComponent(
    {
      ubl: args.ubl as string,
      style: parseInt(args.style),
      language: args.language as string,
    },
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

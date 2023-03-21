import React, { useContext } from "react";

import { JSONValue } from "@src/interfaces";
import { InvoiceTableRow } from "./InvoiceTableRow";
import { useTranslation } from "react-i18next";
import { Detail, extraStyles, styleContext } from "../styles";

import View from "./base/View";
import Text from "./base/Text";
import { i18n } from "i18next";

const baseItems = {
  "ID": [2, "Item ID", Detail.DEFAULT],
  "Note": [5, "Note", Detail.DETAILED],
  "InvoicedQuantity": [2, "Qty", Detail.SUMMARY],
  "LineExtensionAmount": [4, "Subtotal", Detail.SUMMARY],
  "AccountingCost": [3, "Item Type", Detail.DETAILED],
  "InvoicePeriod": [0, "Invoice Period", Detail.DETAILED], // 3
  "OrderLineReference": [0, "Order ID", Detail.DETAILED], // 2
  "DocumentReference": [0, "Document #", Detail.DETAILED], // 3
  "AllowanceCharge": [0, "Surcharge", Detail.DEFAULT], // 3 or 5 with reason
  "Item": [5, "Item", Detail.SUMMARY],
  "Price": [4, "Unit Price", Detail.SUMMARY],
};

const renderOrder = [
  "ID",
  "AccountingCost",
  "Item",
  "InvoicePeriod",
  "OrderLineReference",
  "DocumentReference",
  "Note",
  "Price",
  "InvoicedQuantity",
  "AllowanceCharge",
  "LineExtensionAmount",
];

/**
 * This component renders a table which will hold all data relevant to the invoice items.
 * @param {JSONValue} props - an object containing the invoice lines and i18n translation module
 */
export const InvoiceTable = (props: {
  invoiceLines: JSONValue[];
  i18next: i18n;
}) => {
  const userStyle = extraStyles[useContext(styleContext)];
  const invoiceLines = props.invoiceLines;
  const usedWeights = {};

  const { t: translateHook } = useTranslation();

  invoiceLines.forEach((line) => {
    Object.keys(line).forEach((item) => {
      if (!usedWeights[item])
        usedWeights[item] =
          baseItems[item][2] <= userStyle["meta"].detail
            ? baseItems[item][0]
            : 0;
    });
  });

  const totalWeight = Object.keys(usedWeights).reduce(
    (p: number, n: string) => p + usedWeights[n],
    0
  );
  const widths = Object.keys(usedWeights)
    .filter((item) => usedWeights[item])
    .reduce((p: { [x: string]: { width: string } }, item: string) => {
      p[item] = { width: `${(usedWeights[item] / totalWeight) * 100}%` };
      return p;
    }, {});

  return (
    <View>
      <Text style={userStyle["h1"]} wrap={false}>
        {translateHook("invoice_items")}
      </Text>
      <View style={userStyle["tableWrapper"]}>
        <View style={userStyle["row"]} wrap={false}>
          {renderOrder
            .filter((item) => usedWeights[item])
            .map((item, i) => (
              <View key={i} style={[userStyle["col"], widths[item]]}>
                <Text style={userStyle["bold"]}>
                  {translateHook(baseItems[item][1])}
                </Text>
              </View>
            ))}
        </View>
        {invoiceLines.map((line, i) => (
          <InvoiceTableRow
            key={i}
            invoiceLine={line}
            widths={widths}
            i18next={props.i18next}
          />
        ))}
      </View>
    </View>
  );
};

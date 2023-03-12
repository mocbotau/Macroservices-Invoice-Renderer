import React, { useContext } from "react";

import { JSONValue } from "@src/interfaces";
import { InvoiceTableRow } from "./InvoiceTableRow";
import { Detail, extraStyles, styleContext } from "../styles";

import View from "./base/View";
import Text from "./base/Text";

const baseItems = {
  "ID": [2, "Item ID", Detail.DEFAULT],
  "Note": [5, "Note", Detail.DETAILED],
  "InvoicedQuantity": [2, "Qty.", Detail.SUMMARY],
  "LineExtensionAmount": [4, "Subtotal", Detail.SUMMARY],
  "AccountingCost": [3, "Item Code", Detail.DETAILED],
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

export const InvoiceTable = (props: { invoiceLines: JSONValue[] }) => {
  const userStyle = extraStyles[useContext(styleContext)];

  const invoiceLines = props.invoiceLines;
  const usedWeights = {};

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
      <Text style={userStyle["h1"]}>Invoice Items</Text>
      <View style={userStyle["tableWrapper"]}>
        <View style={userStyle["row"]}>
          {renderOrder
            .filter((item) => usedWeights[item])
            .map((item, i) => (
              <View key={i} style={[userStyle["col"], widths[item]]}>
                <Text style={userStyle["bold"]}>{baseItems[item][1]}</Text>
              </View>
            ))}
        </View>
        {invoiceLines.map((line, i) => (
          <InvoiceTableRow key={i} invoiceLine={line} widths={widths} />
        ))}
      </View>
    </View>
  );
};

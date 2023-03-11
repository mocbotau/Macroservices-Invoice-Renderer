import React from "react";

import { JSONValue } from "@src/interfaces";
import { InvoiceTableRow } from "./InvoiceTableRow";
import { styles } from "../styles";
import { useTranslation } from "react-i18next";

import View from "./base/View";
import Text from "./base/Text";
import { i18n } from "i18next";

const baseItems = {
  "ID": [2, "Item ID"],
  "Note": [5, "Note"],
  "InvoicedQuantity": [2, "Qty"],
  "LineExtensionAmount": [4, "Subtotal"],
  "AccountingCost": [3, "Item Type"],
  "InvoicePeriod": [0, "Invoice Period"], // 3
  "OrderLineReference": [0, "Order ID"], // 2
  "DocumentReference": [0, "Document #"], // 3
  "AllowanceCharge": [0, "Surcharge"], // 3 or 5 with reason
  "Item": [5, "Item"],
  "Price": [4, "Unit Price"],
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

export const InvoiceTable = (props: {
  invoiceLines: JSONValue[];
  i18next: i18n;
}) => {
  const invoiceLines = props.invoiceLines;
  const usedWeights = {};

  const { t: translateHook } = useTranslation();

  invoiceLines.forEach((line) => {
    Object.keys(line).forEach((item) => {
      if (!usedWeights[item]) usedWeights[item] = baseItems[item][0];
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
      <Text style={[styles.h1]}>{translateHook("invoice_items")}</Text>
      <View style={styles.tableWrapper}>
        <View style={[styles.row, { borderTopWidth: 0 }]}>
          {renderOrder
            .filter((item) => usedWeights[item])
            .map((item, i) => (
              <View
                key={i}
                style={[
                  styles.col,
                  widths[item],
                  i === 0 ? { borderLeftWidth: 0 } : {},
                ]}
              >
                <Text style={styles.bold}>
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

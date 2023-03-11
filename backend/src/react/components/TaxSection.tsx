import React from "react";

import { JSONValue } from "@src/interfaces";
import { styles } from "../styles";
import { formatCurrency } from "@src/util";

import View from "./base/View";
import Text from "./base/Text";

export const TaxSection = (props: { taxTotal: JSONValue }) => {
  const taxTotal = props.taxTotal;

  return (
    <View>
      <Text style={styles.h1}>Tax Summary</Text>
      <View style={[styles.tableWrapper]}>
        <View style={[styles.row, { borderTopWidth: 0 }]}>
          <Text
            style={[
              styles.col,
              styles.bold,
              { borderLeftWidth: 0, width: "40%" },
            ]}
          >
            Tax Item
          </Text>
          <Text style={[styles.col, styles.bold, { width: "20%" }]}>
            Taxable Amount
          </Text>
          <Text style={[styles.col, styles.bold, { width: "20%" }]}>
            Tax Percent
          </Text>
          <Text style={[styles.col, styles.bold, { width: "20%" }]}>
            Tax Subtotal
          </Text>
        </View>
        {(taxTotal["TaxSubtotal"] as JSONValue[]).map((item, i) => (
          <View style={[styles.row]} key={i}>
            <Text style={[styles.col, { borderLeftWidth: 0, width: "40%" }]}>
              {/* Some people think it's funny to not follow the spec. */}
              {item["TaxCategory"]["TaxScheme"]["ID"]["_text"] ||
                item["TaxCategory"]["TaxScheme"]["ID"]}
            </Text>
            <Text style={[styles.col, { width: "20%" }]}>
              {formatCurrency(item["TaxableAmount"])}
            </Text>
            <Text style={[styles.col, { width: "20%" }]}>
              {item["TaxCategory"]["Percent"] !== undefined
                ? `${item["TaxCategory"]["Percent"]}%`
                : ""}
            </Text>
            <Text style={[styles.col, { width: "20%", textAlign: "right" }]}>
              {formatCurrency(item["TaxAmount"])}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

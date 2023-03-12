import React, { useContext } from "react";

import { JSONValue } from "@src/interfaces";
import { extraStyles, styleContext } from "../styles";
import { formatCurrency } from "@src/util";

import View from "./base/View";
import Text from "./base/Text";

export const TaxSection = (props: { taxTotal: JSONValue }) => {
  const userStyle = extraStyles[useContext(styleContext)];
  const taxTotal = props.taxTotal;

  return (
    <View>
      <Text style={userStyle["h1"]}>Tax Summary</Text>
      <View style={[userStyle["tableWrapper"]]}>
        <View style={userStyle["row"]}>
          <Text style={[userStyle["col"], userStyle["bold"], { width: "40%" }]}>
            Tax Item
          </Text>
          <Text style={[userStyle["col"], userStyle["bold"], { width: "20%" }]}>
            Taxable Amount
          </Text>
          <Text style={[userStyle["col"], userStyle["bold"], { width: "20%" }]}>
            Tax Percent
          </Text>
          <Text style={[userStyle["col"], userStyle["bold"], { width: "20%" }]}>
            Tax Subtotal
          </Text>
        </View>
        {(taxTotal["TaxSubtotal"] as JSONValue[]).map((item, i) => (
          <View style={[userStyle["row"]]} key={i}>
            <Text style={[userStyle["col"], { width: "40%" }]}>
              {/* Some people think it's funny to not follow the spec. */}
              {item["TaxCategory"]["TaxScheme"]["ID"]["_text"] ||
                item["TaxCategory"]["TaxScheme"]["ID"]}
            </Text>
            <Text style={[userStyle["col"], { width: "20%" }]}>
              {formatCurrency(item["TaxableAmount"])}
            </Text>
            <Text style={[userStyle["col"], { width: "20%" }]}>
              {item["TaxCategory"]["Percent"] !== undefined
                ? `${item["TaxCategory"]["Percent"]}%`
                : ""}
            </Text>
            <Text
              style={[userStyle["col"], { width: "20%", textAlign: "right" }]}
            >
              {formatCurrency(item["TaxAmount"])}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

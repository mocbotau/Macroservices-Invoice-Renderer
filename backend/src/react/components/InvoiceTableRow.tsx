import React from "react";

import { JSONValue } from "@src/interfaces";
import { styles } from "../styles";
import { formatCurrency } from "@src/util";

import View from "./base/View";
import Text from "./base/Text";

export const InvoiceTableRow = (props: {
  key: number;
  invoiceLine: JSONValue;
  widths: { [x: string]: { width: string } };
}) => {
  const defaultGST = 10;
  const widths = props.widths;
  const invoiceLine = props.invoiceLine;

  return (
    <View style={styles.row}>
      {widths["ID"] && (
        <View style={[styles.col, widths["ID"], { borderLeftWidth: 0 }]}>
          <Text>{invoiceLine["ID"]}</Text>
        </View>
      )}
      {widths["AccountingCost"] && (
        <View style={[styles.col, widths["AccountingCost"]]}>
          <Text>{invoiceLine["AccountingCost"]}</Text>
        </View>
      )}
      {widths["Item"] && (
        // Omitting lots of properties
        <View style={[styles.col, widths["Item"]]}>
          <Text>
            {invoiceLine["Item"]["Name"]}
            {invoiceLine["Item"]["ClassifiedTaxCategory"]["Percent"] ===
            defaultGST
              ? ""
              : " *"}
          </Text>
          {invoiceLine["Item"]["Description"] && (
            <Text style={[styles.oblique]}>
              {invoiceLine["Item"]["Description"]}
            </Text>
          )}
        </View>
      )}
      {widths["InvoicePeriod"] && (
        // Not rendering this for now
        <View style={[styles.col, widths["InvoicePeriod"]]}></View>
      )}
      {widths["OrderLineReference"] && (
        <View style={[styles.col, widths["OrderLineReference"]]}>
          <Text>
            {invoiceLine["OrderLineReference"]
              ? invoiceLine["OrderLineReference"]["LineID"]
              : ""}
          </Text>
        </View>
      )}
      {widths["DocumentReference"] && (
        <View style={[styles.col, widths["DocumentReference"]]}>
          <Text>
            {invoiceLine["DocumentReference"]
              ? `${invoiceLine["DocumentReference"]["ID"]["_text"]}`
              : ""}
          </Text>
        </View>
      )}
      {widths["Note"] && (
        <View style={[styles.col, widths["Note"]]}>
          <Text>{invoiceLine["Note"]}</Text>
        </View>
      )}
      {widths["Price"] && (
        // Omitting units and discount
        <View style={[styles.col, widths["Price"]]}>
          <Text>{formatCurrency(invoiceLine["Price"]["PriceAmount"])}</Text>
          {invoiceLine["Price"]["BaseQuantity"] &&
          invoiceLine["Price"]["BaseQuantity"]["_text"] !== 1 ? (
            <Text>{` / ${invoiceLine["Price"]["BaseQuantity"]["_text"]}`}</Text>
          ) : (
            <View />
          )}
        </View>
      )}
      {widths["InvoicedQuantity"] && (
        // Omitting units
        <View style={[styles.col, widths["InvoicedQuantity"]]}>
          <Text>{invoiceLine["InvoicedQuantity"]["_text"]}</Text>
        </View>
      )}
      {widths["AllowanceCharge"] && (
        // Not rendering this for now
        <View style={[styles.col, widths["AllowanceCharge"]]}></View>
      )}
      {widths["LineExtensionAmount"] && (
        <View style={[styles.col, widths["LineExtensionAmount"]]}>
          <Text style={{ textAlign: "right" }}>
            {formatCurrency(invoiceLine["LineExtensionAmount"])}
          </Text>
        </View>
      )}
    </View>
  );
};

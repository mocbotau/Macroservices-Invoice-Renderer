import React, { useContext } from "react";

import { JSONValue } from "@src/interfaces";
import { Detail, extraStyles, styleContext } from "../styles";
import { formatCurrency } from "@src/util";
import { i18n } from "i18next";

import View from "./base/View";
import Text from "./base/Text";
import { Show } from "./Show";

/**
 * This component renders a table row within the invoice table
 * @param {JSONValue} props - an object containing the supplier Party, customerParty and the i18n translation module
 */
export const InvoiceTableRow = (props: {
  key?: number;
  invoiceLine: JSONValue;
  widths: { [x: string]: { width: string } };
  i18next: i18n;
}) => {
  const userStyle = extraStyles[useContext(styleContext)];

  const defaultGST = 10;
  const widths = props.widths;
  const invoiceLine = props.invoiceLine;

  return (
    <View style={userStyle["row"]} wrap={false}>
      {widths["ID"] && (
        <View style={[userStyle["col"], widths["ID"]]}>
          <Text>{invoiceLine["ID"]}</Text>
        </View>
      )}
      {widths["AccountingCost"] && (
        <View style={[userStyle["col"], widths["AccountingCost"]]}>
          <Text>{invoiceLine["AccountingCost"]}</Text>
        </View>
      )}
      {widths["Item"] && (
        // Omitting lots of properties
        <View style={[userStyle["col"], widths["Item"]]}>
          <Text>
            {invoiceLine["Item"]["Name"]}
            {invoiceLine["Item"]["ClassifiedTaxCategory"]["Percent"] ===
            defaultGST
              ? ""
              : " *"}
          </Text>
          <Show min={Detail.DETAILED}>
            {invoiceLine["Item"]["Description"] && (
              <Text style={userStyle["oblique"]}>
                {invoiceLine["Item"]["Description"]}
              </Text>
            )}
          </Show>
        </View>
      )}
      {widths["InvoicePeriod"] && (
        // Not rendering this for now
        <View style={[userStyle["col"], widths["InvoicePeriod"]]}></View>
      )}
      {widths["OrderLineReference"] && (
        <View style={[userStyle["col"], widths["OrderLineReference"]]}>
          <Text>
            {invoiceLine["OrderLineReference"]
              ? invoiceLine["OrderLineReference"]["LineID"]
              : ""}
          </Text>
        </View>
      )}
      {widths["DocumentReference"] && (
        <View style={[userStyle["col"], widths["DocumentReference"]]}>
          <Text>
            {invoiceLine["DocumentReference"]
              ? `${invoiceLine["DocumentReference"]["ID"]["_text"]}`
              : ""}
          </Text>
        </View>
      )}
      {widths["Note"] && (
        <View style={[userStyle["col"], widths["Note"]]}>
          <Text>{invoiceLine["Note"]}</Text>
        </View>
      )}
      {widths["Price"] && (
        // Omitting units and discount
        <View style={[userStyle["col"], widths["Price"]]}>
          <Text style={{ textAlign: "right" }}>
            {formatCurrency(invoiceLine["Price"]["PriceAmount"])}
          </Text>
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
        <View style={[userStyle["col"], widths["InvoicedQuantity"]]}>
          <Text style={{ textAlign: "right" }}>
            {invoiceLine["InvoicedQuantity"]["_text"]}
          </Text>
        </View>
      )}
      {widths["AllowanceCharge"] && (
        // Not rendering this for now
        <View style={[userStyle["col"], widths["AllowanceCharge"]]}></View>
      )}
      {widths["LineExtensionAmount"] && (
        <View style={[userStyle["col"], widths["LineExtensionAmount"]]}>
          <Text style={{ textAlign: "right" }}>
            {formatCurrency(invoiceLine["LineExtensionAmount"])}
          </Text>
        </View>
      )}
    </View>
  );
};

import React, { useContext } from "react";

import { JSONValue } from "@src/interfaces";
import { Detail, extraStyles, styleContext } from "../styles";
import { formatCurrency } from "@src/util";

import View from "./base/View";
import Text from "./base/Text";
import { Show } from "./Show";

const renderOrder = [
  ["LineExtensionAmount", "Subtotal (items)"],
  ["AllowanceTotalAmount", "Total discount"],
  ["ChargeTotalAmount", "Total additional charges"],
  ["TaxExclusiveAmount", "Subtotal (before tax)"],
  ["TaxInclusiveAmount", "Subtotal (after tax)"],
  ["PrepaidAmount", "Credit"],
  ["PayableRoundingAmount", "Rounding"],
  ["PayableAmount", "Payable amount"],
];

export const MonetaryTotal = (props: { legalMonetaryTotal: JSONValue }) => {
  const userStyle = extraStyles[useContext(styleContext)];
  const totals = props.legalMonetaryTotal;

  if (!totals["AllowanceTotalAmount"] && !totals["ChargeTotalAmount"]) {
    delete totals["LineExtensionAmount"];
  }

  return (
    <View
      style={[
        userStyle["tableWrapper"],
        userStyle["borderless"],
        userStyle["totalTable"],
      ]}
    >
      {renderOrder
        .filter((item) => item[0] in (totals as Object))
        .map((item, i) => (
          <Show
            min={
              ["PayableAmount, TaxExclusiveAmount"].includes(item[0])
                ? Detail.SUMMARY
                : Detail.DEFAULT
            }
            key={i}
          >
            <View
              style={[
                userStyle["row"],
                userStyle["borderless"],
                item[0] === "PayableAmount"
                  ? { borderTopWidth: 2, borderColor: "black", marginTop: 8 }
                  : {},
                item[0] === "PayableAmount" ? userStyle["break"] : {},
              ]}
            >
              <Text
                style={[
                  userStyle["col"],
                  userStyle["borderless"],
                  { width: "60%", padding: 2 },
                  item[0] === "PayableAmount" ? userStyle["big"] : {},
                ]}
              >
                {item[1]}:
              </Text>
              <Text
                style={[
                  userStyle["col"],
                  userStyle["borderless"],
                  { width: "40%", textAlign: "right", padding: 2 },
                  item[0] === "PayableAmount" ? userStyle["big"] : {},
                ]}
              >
                {formatCurrency(totals[item[0]])}
              </Text>
            </View>
          </Show>
        ))}
    </View>
  );
};

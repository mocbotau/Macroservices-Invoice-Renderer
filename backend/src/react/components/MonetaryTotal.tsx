import React from "react";

import { JSONValue } from "@src/interfaces";
import { defaultStyles } from "../styles";
import { formatCurrency } from "@src/util";

import View from "./base/View";
import Text from "./base/Text";

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
  const totals = props.legalMonetaryTotal;

  if (!totals["AllowanceTotalAmount"] && !totals["ChargeTotalAmount"]) {
    delete totals["LineExtensionAmount"];
  }

  return (
    <View
      style={[
        defaultStyles.tableWrapper,
        defaultStyles.borderless,
        defaultStyles.totalTable,
      ]}
    >
      {renderOrder
        .filter((item) => item[0] in (totals as Object))
        .map((item, i) => (
          <View
            style={[
              defaultStyles.row,
              defaultStyles.borderless,
              item[0] === "PayableAmount"
                ? { borderTop: 2, borderColor: "black", marginTop: 8 }
                : {},
            ]}
            key={i}
          >
            <Text
              style={[
                defaultStyles.col,
                defaultStyles.borderless,
                { width: "60%", padding: 2 },
                item[0] === "PayableAmount" ? defaultStyles.big : {},
              ]}
            >
              {item[1]}:
            </Text>
            <Text
              style={[
                defaultStyles.col,
                defaultStyles.borderless,
                { width: "40%", textAlign: "right", padding: 2 },
                item[0] === "PayableAmount" ? defaultStyles.big : {},
              ]}
            >
              {formatCurrency(totals[item[0]])}
            </Text>
          </View>
        ))}
    </View>
  );
};

import React from "react";
import { View, Text } from "@react-pdf/renderer";

import { JSONValue } from "@src/interfaces";
import { styles } from "../styles";
import { formatCurrency } from "@src/util";

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
    <View style={[styles.tableWrapper_borderless, styles.totalTable]}>
      {renderOrder
        .filter((item) => item[0] in (totals as Object))
        .map((item, i) => (
          <View
            style={[
              styles.row_borderless,
              item[0] === "PayableAmount"
                ? { borderTop: 2, borderColor: "black", marginTop: 8 }
                : {},
            ]}
            key={i}
          >
            <Text
              style={[
                styles.col_borderless,
                { width: "60%", padding: 2 },
                item[0] === "PayableAmount" ? styles.big : {},
              ]}
            >
              {item[1]}:
            </Text>
            <Text
              style={[
                styles.col_borderless,
                { width: "40%", textAlign: "right", padding: 2 },
                item[0] === "PayableAmount" ? styles.big : {},
              ]}
            >
              {formatCurrency(totals[item[0]])}
            </Text>
          </View>
        ))}
    </View>
  );
};

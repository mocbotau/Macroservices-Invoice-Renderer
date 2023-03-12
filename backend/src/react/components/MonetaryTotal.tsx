import React, { useContext } from "react";

import { JSONValue } from "@src/interfaces";
import { Detail, extraStyles, styleContext } from "../styles";
import { formatCurrency } from "@src/util";
import { useTranslation } from "react-i18next";
import { i18n } from "i18next";

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

/**
 * This component renders the subtotals and payable amounts for the invoice.
 * @param {JSONValue} props - an object containing the legal monetary total, and the i18n translation module
 */
export const MonetaryTotal = (props: {
  legalMonetaryTotal: JSONValue;
  i18next: i18n;
}) => {
  const userStyle = extraStyles[useContext(styleContext)];
  const totals = props.legalMonetaryTotal;

  if (!totals["AllowanceTotalAmount"] && !totals["ChargeTotalAmount"]) {
    delete totals["LineExtensionAmount"];
  }
  const { t: translateHook } = useTranslation();

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
                {translateHook(item[1])}:
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

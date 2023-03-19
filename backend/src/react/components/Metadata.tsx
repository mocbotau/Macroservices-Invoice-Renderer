import React, { useContext } from "react";

import { Detail, extraStyles, styleContext } from "../styles";
import { JSONValue, PeriodType } from "@src/interfaces";
import { Break } from "./Break";
import { useTranslation } from "react-i18next";

import View from "./base/View";
import Text from "./base/Text";
import { i18n } from "i18next";
import { Show } from "./Show";
import { COUNTRY_MAP } from "@src/constants";

/**
 * This component renders the metadata associated with an invoice.
 * @param {JSONValue} props - an object containing the id, invoice period, issue date, due date, accounting cost, payments terms, notes delivery and i18 translation module.
 */
export const Metadata = (props: {
  id: JSONValue;
  invoicePeriod: PeriodType;
  issueDate: JSONValue;
  dueDate: JSONValue;
  accountingCost: JSONValue;
  paymentTerms: JSONValue;
  note: JSONValue;
  i18next: i18n;
  delivery: JSONValue;
}) => {
  const userStyle = extraStyles[useContext(styleContext)];
  const note = [
    props.note,
    props.paymentTerms ? props.paymentTerms["Note"] : undefined,
  ].filter((x) => x);

  let deliveryAddress: JSONValue, countryCode: string;
  const { t: translateHook } = useTranslation();

  if (props.delivery && props.delivery["DeliveryLocation"]) {
    deliveryAddress = props.delivery["DeliveryLocation"]["Address"];
    countryCode =
      deliveryAddress["Country"]["IdentificationCode"]["_text"] ||
      deliveryAddress["Country"]["IdentificationCode"];
  }

  let period = "";
  if (props.invoicePeriod) {
    if (props.invoicePeriod["StartDate"] && props.invoicePeriod["EndDate"]) {
      period = `${props.invoicePeriod["StartDate"]} - ${props.invoicePeriod["EndDate"]}`;
    } else if (props.invoicePeriod["StartDate"]) {
      period = translateHook("period_start_date", {
        start_date: props.invoicePeriod["StartDate"],
      });
    } else if (props.invoicePeriod["EndDate"]) {
      period = translateHook("period_end_date", {
        end_date: props.invoicePeriod["EndDate"],
      });
    } else {
      period = translateHook("unknown_period");
    }
  }

  return (
    <View wrap={true}>
      <View style={[userStyle["horizontalFlex"], { flexWrap: "wrap" }]}>
        <View style={[userStyle["flexbox"], userStyle["metadata"]]}>
          <Text style={userStyle["bold"]}>{translateHook("invoice_id")}</Text>
          <Text>{props.id.toString()}</Text>
        </View>
        {props.invoicePeriod && (
          <Show
            min={Detail.DEFAULT}
            style={[userStyle["flexbox"], userStyle["metadata"]]}
          >
            <Text style={userStyle["bold"]}>
              {translateHook("invoice_period")}
            </Text>
            <Text>{period}</Text>
          </Show>
        )}
        <View style={[userStyle["flexbox"], userStyle["metadata"]]}>
          <Text style={userStyle["bold"]}>{translateHook("issue_date")}</Text>
          <Text>{props.issueDate.toString()}</Text>
        </View>
        {props.dueDate && (
          <View style={[userStyle["flexbox"], userStyle["metadata"]]}>
            <Text style={userStyle["bold"]}>{translateHook("due_date")} </Text>
            <Text>{props.dueDate.toString()}</Text>
          </View>
        )}
        {props.delivery && (
          <Show
            min={Detail.DEFAULT}
            style={[userStyle["flexbox"], userStyle["metadata"]]}
          >
            <Text style={userStyle["bold"]}>
              {translateHook("delivery_details")}{" "}
            </Text>
            {props.delivery["ActualDeliveryDate"] && (
              <Text>
                {translateHook("delivered_on", {
                  delivery_date: props.delivery["ActualDeliveryDate"],
                })}
              </Text>
            )}
            {props.delivery["DeliveryParty"] && (
              <Text>
                {translateHook("delivered_to", {
                  delivery_party:
                    props.delivery["DeliveryParty"]["PartyName"]["Name"],
                })}
              </Text>
            )}
            {(props.delivery["ActualDeliveryDate"] ||
              props.delivery["DeliveryParty"]) && <Break height={8} />}
            {deliveryAddress && (
              <View>
                {deliveryAddress["StreetName"] && (
                  <Text>{deliveryAddress["StreetName"]}</Text>
                )}
                {deliveryAddress["AdditionalStreetName"] && (
                  <Text>{deliveryAddress["AdditionalStreetName"]}</Text>
                )}
                <Text>
                  {[
                    deliveryAddress["CityName"],
                    deliveryAddress["CountrySubentity"],
                    deliveryAddress["PostalZone"],
                  ]
                    .filter((x) => x !== undefined)
                    .join(" ")}
                </Text>
                <Text>{COUNTRY_MAP[countryCode] || countryCode}</Text>
                {deliveryAddress["AddressLine"] && (
                  <Text>{deliveryAddress["AddressLine"]["Line"]}</Text>
                )}
              </View>
            )}
          </Show>
        )}
        {props.accountingCost && (
          <View style={[userStyle["flexbox"], userStyle["metadata"]]}>
            <Text style={userStyle["bold"]}>
              {translateHook("invoice_category")}
            </Text>
            <Text>{props.accountingCost.toString()}</Text>
          </View>
        )}
      </View>
      {note.length && (
        <Show min={Detail.DEFAULT}>
          <Break />
          <Text style={userStyle["bold"]}>{translateHook("invoice_note")}</Text>
          <Text>{note.join("\n")}</Text>
        </Show>
      )}
    </View>
  );
};

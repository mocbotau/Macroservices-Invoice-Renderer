import React, { useContext } from "react";

import { Detail, extraStyles, styleContext } from "../styles";
import { JSONValue } from "@src/interfaces";
import { Break } from "./Break";

import View from "./base/View";
import Text from "./base/Text";
import { Show } from "./Show";
import { getPeriodString } from "@src/util";
import { COUNTRY_MAP } from "@src/constants";

export const Metadata = (props: {
  id: JSONValue;
  invoicePeriod: JSONValue;
  issueDate: JSONValue;
  dueDate: JSONValue;
  accountingCost: JSONValue;
  paymentTerms: JSONValue;
  note: JSONValue;
  delivery: JSONValue;
}) => {
  const userStyle = extraStyles[useContext(styleContext)];
  const note = [
    props.note,
    props.paymentTerms ? props.paymentTerms["Note"] : undefined,
  ].filter((x) => x);

  let deliveryAddress, countryCode;
  if (props.delivery && props.delivery["DeliveryLocation"]) {
    deliveryAddress = props.delivery["DeliveryLocation"]["Address"];
    countryCode =
      deliveryAddress["Country"]["IdentificationCode"]["_text"] ||
      deliveryAddress["Country"]["IdentificationCode"];
  }

  return (
    <View>
      <View style={[userStyle["horizontalFlex"], { flexWrap: "wrap" }]}>
        <View style={userStyle["flexbox"]}>
          <Text style={userStyle["bold"]}>Invoice ID</Text>
          <Text>{props.id.toString()}</Text>
        </View>
        {props.invoicePeriod && (
          <Show min={Detail.DEFAULT} style={userStyle["flexbox"]}>
            <Text style={userStyle["bold"]}>Invoice period</Text>
            <Text>{getPeriodString(props.invoicePeriod)}</Text>
          </Show>
        )}
        <View style={userStyle["flexbox"]}>
          <Text style={userStyle["bold"]}>Issue date</Text>
          <Text>{props.issueDate.toString()}</Text>
        </View>
        {props.dueDate && (
          <View style={userStyle["flexbox"]}>
            <Text style={userStyle["bold"]}>Due date</Text>
            <Text>{props.dueDate.toString()}</Text>
          </View>
        )}
        {props.delivery && (
          <Show min={Detail.DEFAULT} style={userStyle["flexbox"]}>
            <Text style={userStyle["bold"]}>Delivery details</Text>
            {props.delivery["ActualDeliveryDate"] && (
              <Text>{`Delivered on:\n${props.delivery["ActualDeliveryDate"]}`}</Text>
            )}
            {props.delivery["DeliveryParty"] && (
              <Text>{`Delivered to:\n${props.delivery["DeliveryParty"]["PartyName"]["Name"]}`}</Text>
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
          <View style={userStyle["flexbox"]}>
            <Text style={userStyle["bold"]}>Invoice category</Text>
            <Text>{props.accountingCost.toString()}</Text>
          </View>
        )}
      </View>
      {note.length && (
        <Show min={Detail.DEFAULT}>
          <Break />
          <Text style={userStyle["bold"]}>Invoice note</Text>
          <Text>{note.join("\n")}</Text>
        </Show>
      )}
    </View>
  );
};

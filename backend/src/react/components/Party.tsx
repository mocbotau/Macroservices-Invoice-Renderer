import React, { useContext } from "react";

import { Detail, extraStyles, styleContext } from "../styles";
import { JSONValue } from "@src/interfaces";
import { ABN_ID } from "@src/constants";
import { Break } from "./Break";

import View from "./base/View";
import Text from "./base/Text";
import { Show } from "./Show";
import countryMap from "i18n-iso-countries";
import i18next from "i18next";

/**
 * This component renders the data relating to the parties of the invoice
 * @param {JSONValue} props - an object containing the party information
 */
export const Party = (props: { party: JSONValue }) => {
  const userStyle = extraStyles[useContext(styleContext)];

  const party = props.party;
  const postalAddress = party["PostalAddress"];

  const ABN =
    (party["PartyLegalEntity"]["CompanyID"]
      ? party["PartyLegalEntity"]["CompanyID"]["_text"]
      : undefined) ||
    (party["EndpointID"] ? party["EndpointID"]["_text"] : undefined);

  const partyName =
    (party["PartyName"] ? party["PartyName"]["Name"] : undefined) ||
    party["PartyLegalEntity"]["RegistrationName"];

  const countryCode =
    postalAddress["Country"]["IdentificationCode"]["_text"] ||
    postalAddress["Country"]["IdentificationCode"];

  // Some people like including the ABN again here, which is annoying
  if (party["PartyIdentification"]) {
    party["PartyIdentification"] = party["PartyIdentification"].filter(
      (id) => id["$schemeID"] !== ABN_ID
    );
  }

  return (
    <View>
      {party["Contact"] && (
        <View>
          {party["Contact"]["Name"] && <Text>{party["Contact"]["Name"]}</Text>}
          {party["Contact"]["Telephone"] && (
            <Text>{party["Contact"]["Telephone"]}</Text>
          )}
          {party["Contact"]["ElectronicMail"] && (
            <Text>{party["Contact"]["ElectronicMail"]}</Text>
          )}
          <Break height={8} />
        </View>
      )}

      {partyName && <Text style={userStyle["bold"]}>{partyName}</Text>}
      {ABN && <Text>ABN: {ABN}</Text>}
      <Show min={Detail.DEFAULT}>
        <Break height={8} />

        {postalAddress["AdditionalStreetName"] && (
          <Text>{postalAddress["AdditionalStreetName"]}</Text>
        )}
        {postalAddress["StreetName"] && (
          <Text>{postalAddress["StreetName"]}</Text>
        )}
        <Text>
          {[
            postalAddress["CityName"],
            postalAddress["CountrySubentity"],
            postalAddress["PostalZone"],
          ]
            .filter((x) => x !== undefined)
            .join(" ")}
        </Text>
        <Text>
          {countryMap.isValid(countryCode)
            ? countryMap.getName(countryCode, i18next.language)
            : countryCode}
        </Text>
        {postalAddress["AddressLine"] && (
          <Text>{postalAddress["AddressLine"]["Line"]}</Text>
        )}

        {party["PartyIdentification"] && (
          <Show min={Detail.DETAILED}>
            <Break height={8} />
            <Text>Additional ID:</Text>
            <Break height={2} />
            {party["PartyIdentification"].map((id, i) => (
              <Text key={i}>{id["ID"]["_text"]}</Text>
            ))}
          </Show>
        )}
      </Show>
    </View>
  );
};

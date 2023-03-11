import React from "react";

import { styles } from "../styles";
import { JSONValue } from "@src/interfaces";
import { ABN_ID, COUNTRY_MAP } from "@src/constants";
import { Break } from "./Break";

import View from "./base/View";
import Text from "./base/Text";

export const Party = (props: { party: JSONValue }) => {
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

      {partyName && <Text style={styles.bold}>{partyName}</Text>}
      {ABN && <Text>ABN: {ABN}</Text>}

      <Break height={8} />

      {postalAddress["StreetName"] && (
        <Text>{postalAddress["StreetName"]}</Text>
      )}
      {postalAddress["AdditionalStreetName"] && (
        <Text>{postalAddress["AdditionalStreetName"]}</Text>
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
      <Text>{COUNTRY_MAP[countryCode]}</Text>
      {postalAddress["AddressLine"] && (
        <Text>{postalAddress["AddressLine"]["Line"]}</Text>
      )}

      {party["PartyIdentification"] && (
        <View>
          <Break height={8} />
          {party["PartyIdentification"].map((id, i) => (
            <Text key={i}>{id["ID"]["_text"]}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

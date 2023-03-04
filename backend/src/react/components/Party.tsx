import React from "react";
import {
  Text,
  View,
} from "@react-pdf/renderer";

import { styles } from "../styles";
import { JSONValue } from "@src/interfaces";

export const Party = (props: {party: JSONValue}) => {
  const party = props.party;
  const postalAddress = party["PostalAddress"];

  return (
    <View style={styles.section}>
      <Text style={styles.bold}>{party["PartyName"]["Name"]}</Text>
      {party["PartyIdentification"] && <Text>ABN {party["PartyIdentification"]}</Text>}
      <Text>{postalAddress["StreetName"]}, {postalAddress["CityName"]} {postalAddress["cbc:PostalZone"]}</Text>
      <Text>{postalAddress["Country"]["IdentificationCode"]["#text"]}</Text>
    </View>
  );
}
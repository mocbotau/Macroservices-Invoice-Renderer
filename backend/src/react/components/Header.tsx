import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { styles } from "../styles";
import { JSONValue } from "@src/interfaces";

export const Header = (props: {
  supplierParty: JSONValue;
  customerParty: JSONValue;
}) => {
  return <View style={styles.section}></View>;
};

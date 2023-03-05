import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { styles } from "../styles";
import { JSONValue } from "@src/interfaces";

import { Party } from "./Party";

export const Header = (props: {
  supplierParty: JSONValue;
  customerParty: JSONValue;
}) => {
  return (
    <View>
      <Text style={[styles.h1, styles.bold]}>Invoice</Text>
      <View style={styles.horizontalFlex}>
        <View style={styles.flexbox}>
          <Text style={styles.h2}>From:</Text>
          <Party party={props.customerParty["Party"]} />
        </View>
        <View style={styles.flexbox}>
          <Text style={styles.h2}>To:</Text>
          <Party party={props.supplierParty["Party"]} />
        </View>
      </View>
    </View>
  );
};

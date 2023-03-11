import React from "react";

import { styles } from "../styles";
import { JSONValue } from "@src/interfaces";

import { Party } from "./Party";
import { Break } from "./Break";

import View from "./base/View";
import Text from "./base/Text";

export const Header = (props: {
  supplierParty: JSONValue;
  customerParty: JSONValue;
}) => {
  return (
    <View>
      <Text style={[styles.title, styles.bold]}>Invoice</Text>
      <View style={styles.horizontalFlex}>
        <View style={styles.flexbox}>
          <Text style={styles.h1}>To</Text>
          <Break height={8} />
          <Party party={props.customerParty["Party"]} />
        </View>
        <View style={styles.flexbox}>
          <Text style={styles.h1}>From</Text>
          <Break height={8} />
          <Party party={props.supplierParty["Party"]} />
        </View>
      </View>
    </View>
  );
};

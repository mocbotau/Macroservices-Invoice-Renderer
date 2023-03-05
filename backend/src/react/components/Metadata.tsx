import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { styles } from "../styles";
import { JSONValue } from "@src/interfaces";

export const Metadata = (props: {
  id: JSONValue;
  issueDate: JSONValue;
  paymentTerms: JSONValue;
}) => {
  return (
    <View>
      <View style={styles.horizontalFlex}>
        <View style={styles.flexbox}>
          <Text style={styles.bold}>Invoice ID</Text>
          <Text>{props.id.toString()}</Text>
        </View>
        <View style={styles.flexbox}>
          <Text style={styles.bold}>Issue date</Text>
          <Text>{props.issueDate.toString()}</Text>
        </View>
      </View>
      {props.paymentTerms && (
        <View>
          <Text style={styles.bold}>Payment note</Text>
          <Text>{props.paymentTerms["Note"]}</Text>
        </View>
      )}
    </View>
  );
};

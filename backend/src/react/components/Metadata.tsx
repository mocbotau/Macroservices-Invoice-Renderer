import React from "react";

import { styles } from "../styles";
import { JSONValue } from "@src/interfaces";
import { Break } from "./Break";

import View from "./base/View";
import Text from "./base/Text";

export const Metadata = (props: {
  id: JSONValue;
  issueDate: JSONValue;
  paymentTerms: JSONValue;
  note: JSONValue;
}) => {
  const note = [
    props.note,
    props.paymentTerms ? props.paymentTerms["Note"] : undefined,
  ].filter((x) => x);
  return (
    <View>
      <View style={[styles.horizontalFlex, { flexWrap: "wrap" }]}>
        <View style={styles.flexbox}>
          <Text style={styles.bold}>Invoice ID</Text>
          <Text>{props.id.toString()}</Text>
        </View>
        <View style={styles.flexbox}>
          <Text style={styles.bold}>Issue date</Text>
          <Text>{props.issueDate.toString()}</Text>
        </View>
      </View>
      <Break />
      {note.length && (
        <View>
          <Text style={styles.bold}>Invoice note</Text>
          <Text>{note.join("\n")}</Text>
        </View>
      )}
    </View>
  );
};

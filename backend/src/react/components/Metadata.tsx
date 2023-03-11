import React from "react";

import { defaultStyles } from "../styles";
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
      <View style={[defaultStyles.horizontalFlex, { flexWrap: "wrap" }]}>
        <View style={defaultStyles.flexbox}>
          <Text style={defaultStyles.bold}>Invoice ID</Text>
          <Text>{props.id.toString()}</Text>
        </View>
        <View style={defaultStyles.flexbox}>
          <Text style={defaultStyles.bold}>Issue date</Text>
          <Text>{props.issueDate.toString()}</Text>
        </View>
      </View>
      <Break />
      {note.length && (
        <View>
          <Text style={defaultStyles.bold}>Invoice note</Text>
          <Text>{note.join("\n")}</Text>
        </View>
      )}
    </View>
  );
};

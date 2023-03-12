import React, { useContext } from "react";

import { Detail, extraStyles, styleContext } from "../styles";
import { JSONValue } from "@src/interfaces";
import { Break } from "./Break";

import View from "./base/View";
import Text from "./base/Text";
import { Show } from "./Show";

export const Metadata = (props: {
  id: JSONValue;
  issueDate: JSONValue;
  paymentTerms: JSONValue;
  note: JSONValue;
}) => {
  const userStyle = extraStyles[useContext(styleContext)];
  const note = [
    props.note,
    props.paymentTerms ? props.paymentTerms["Note"] : undefined,
  ].filter((x) => x);
  return (
    <View>
      <View style={[userStyle["horizontalFlex"], { flexWrap: "wrap" }]}>
        <View style={userStyle["flexbox"]}>
          <Text style={userStyle["bold"]}>Invoice ID</Text>
          <Text>{props.id.toString()}</Text>
        </View>
        <View style={userStyle["flexbox"]}>
          <Text style={userStyle["bold"]}>Issue date</Text>
          <Text>{props.issueDate.toString()}</Text>
        </View>
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

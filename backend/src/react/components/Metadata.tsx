import React from "react";

import { styles } from "../styles";
import { JSONValue } from "@src/interfaces";
import { Break } from "./Break";
import { useTranslation } from "react-i18next";

import View from "./base/View";
import Text from "./base/Text";
import { i18n } from "i18next";

export const Metadata = (props: {
  id: JSONValue;
  issueDate: JSONValue;
  paymentTerms: JSONValue;
  note: JSONValue;
  i18next: i18n;
}) => {
  const note = [
    props.note,
    props.paymentTerms ? props.paymentTerms["Note"] : undefined,
  ].filter((x) => x);

  const { t: translateHook, i18n } = useTranslation();

  return (
    <View>
      <View style={[styles.horizontalFlex, { flexWrap: "wrap" }]}>
        <View style={styles.flexbox}>
          <Text style={styles.bold}>{translateHook("invoice_id")}</Text>
          <Text>{props.id.toString()}</Text>
        </View>
        <View style={styles.flexbox}>
          <Text style={styles.bold}>{translateHook("issue_date")}</Text>
          <Text>{props.issueDate.toString()}</Text>
        </View>
      </View>
      <Break />
      {note.length && (
        <View>
          <Text style={styles.bold}>{translateHook("invoice_note")}</Text>
          <Text>{note.join("\n")}</Text>
        </View>
      )}
    </View>
  );
};

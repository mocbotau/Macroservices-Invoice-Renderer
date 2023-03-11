import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { styles } from "../styles";
import { JSONValue } from "@src/interfaces";

import { Party } from "./Party";
import { Break } from "./Break";
import { useTranslation } from "react-i18next";
import { boldLanguage, regularLanguage } from "../utils";

export const Header = (props: {
  supplierParty: JSONValue;
  customerParty: JSONValue;
}) => {
  const { t: translateHook, i18n } = useTranslation();

  return (
    <View>
      <Text style={[styles.title, boldLanguage(i18n.language)]}>
        {translateHook("invoice")}
      </Text>
      <View style={styles.horizontalFlex}>
        <View style={styles.flexbox}>
          <Text style={[styles.h1, regularLanguage(i18n.language)]}>
            {translateHook("to")}
          </Text>
          <Break height={8} />
          <Party party={props.customerParty["Party"]} />
        </View>
        <View style={styles.flexbox}>
          <Text style={[styles.h1, regularLanguage(i18n.language)]}>
            {translateHook("from")}
          </Text>
          <Break height={8} />
          <Party party={props.supplierParty["Party"]} />
        </View>
      </View>
    </View>
  );
};

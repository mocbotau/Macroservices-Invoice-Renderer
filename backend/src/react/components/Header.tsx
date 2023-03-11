import React from "react";

import { styles } from "../styles";
import { JSONValue } from "@src/interfaces";

import { Party } from "./Party";
import { Break } from "./Break";

import View from "./base/View";
import Text from "./base/Text";
import { i18n } from "i18next";
import { useTranslation } from "react-i18next";

export const Header = (props: {
  supplierParty: JSONValue;
  customerParty: JSONValue;
  i18next: i18n;
}) => {
  const { t: translateHook } = useTranslation();
  return (
    <View>
      <Text style={[styles.title, styles.bold]}>
        {translateHook("invoice")}
      </Text>
      <View style={styles.horizontalFlex}>
        <View style={styles.flexbox}>
          <Text style={styles.h1}>{translateHook("to")}</Text>
          <Break height={8} />
          <Party party={props.customerParty["Party"]} />
        </View>
        <View style={styles.flexbox}>
          <Text style={styles.h1}>{translateHook("from")}</Text>
          <Break height={8} />
          <Party party={props.supplierParty["Party"]} />
        </View>
      </View>
    </View>
  );
};

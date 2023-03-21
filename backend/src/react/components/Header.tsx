import React, { useContext } from "react";

import { styleContext, extraStyles, Detail } from "../styles";
import { JSONValue } from "@src/interfaces";

import { Party } from "./Party";
import { Break } from "./Break";

import View from "./base/View";
import Text from "./base/Text";
import { i18n } from "i18next";
import { useTranslation } from "react-i18next";
import { Show } from "./Show";

/**
 * This component renders the header for the invoice file.
 * @param {JSONValue} props - an object containing the supplier Party, customerParty and the i18n translation module
 */
export const Header = (props: {
  supplierParty: JSONValue;
  customerParty: JSONValue;
  i18next: i18n;
}) => {
  const userStyle = extraStyles[useContext(styleContext)];
  const { t: translateHook } = useTranslation();

  return (
    <View>
      <Text style={userStyle["title"]}>{translateHook("invoice")}</Text>
      <View style={userStyle["horizontalFlex"]}>
        <Show
          min={Detail.DEFAULT}
          style={[userStyle["flexbox"], { width: "50%" }]}
        >
          <Text style={userStyle["h1"]}>{translateHook("to")}</Text>
          <Break height={8} />
          <Party party={props.customerParty["Party"]} />
        </Show>
        <View style={[userStyle["flexbox"], { width: "50%" }]}>
          <Text style={userStyle["h1"]}>{translateHook("from")}</Text>
          <Break height={8} />
          <Party party={props.supplierParty["Party"]} />
        </View>
      </View>
    </View>
  );
};

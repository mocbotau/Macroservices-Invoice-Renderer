import React, { useContext } from "react";

import { styleContext, extraStyles, Detail } from "../styles";
import { JSONValue } from "@src/interfaces";

import { Party } from "./Party";
import { Break } from "./Break";

import View from "./base/View";
import Text from "./base/Text";
import { Show } from "./Show";

export const Header = (props: {
  supplierParty: JSONValue;
  customerParty: JSONValue;
}) => {
  const userStyle = extraStyles[useContext(styleContext)];

  return (
    <View>
      <Text style={userStyle["title"]}>Invoice</Text>
      <View style={userStyle["horizontalFlex"]}>
        <Show min={Detail.DEFAULT} style={userStyle["flexbox"]}>
          <Text style={userStyle["h1"]}>To</Text>
          <Break height={8} />
          <Party party={props.customerParty["Party"]} />
        </Show>
        <View style={userStyle["flexbox"]}>
          <Text style={userStyle["h1"]}>From</Text>
          <Break height={8} />
          <Party party={props.supplierParty["Party"]} />
        </View>
      </View>
    </View>
  );
};

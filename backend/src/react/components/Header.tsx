import React, { useCallback, useContext } from "react";

import { defaultStyles, styleContext, extraStyles } from "../styles";
import { JSONValue } from "@src/interfaces";

import { Party } from "./Party";
import { Break } from "./Break";

import View from "./base/View";
import Text from "./base/Text";

export const Header = (props: {
  supplierParty: JSONValue;
  customerParty: JSONValue;
}) => {
  const userStyle = extraStyles[useContext(styleContext)];

  return (
    <View>
      <Text style={[defaultStyles.title, undefined]}>Invoice</Text>
      <View style={defaultStyles.horizontalFlex}>
        <View style={defaultStyles.flexbox}>
          <Text style={defaultStyles.h1}>To</Text>
          <Break height={8} />
          <Party party={props.customerParty["Party"]} />
        </View>
        <View style={defaultStyles.flexbox}>
          <Text style={defaultStyles.h1}>From</Text>
          <Break height={8} />
          <Party party={props.supplierParty["Party"]} />
        </View>
      </View>
    </View>
  );
};

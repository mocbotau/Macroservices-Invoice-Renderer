import React, { useContext } from "react";

import { styleContext, extraStyles, Detail } from "../styles";
import { JSONValue } from "@src/interfaces";

import { Party } from "./Party";
import { Break } from "./Break";

import View from "./base/View";
import Text from "./base/Text";
import Image from "./base/Image";
import { i18n } from "i18next";
import { useTranslation } from "react-i18next";
import { Show } from "./Show";
import { RenderingContexts, renderingContext } from "./base/renderingContext";

/**
 * This component renders the header for the invoice file.
 * @param {JSONValue} props - an object containing the supplier Party, customer
 * Party, an optional icon buffer, and the i18n translation module
 */
export const Header = (props: {
  supplierParty: JSONValue;
  customerParty: JSONValue;
  icon?: string;
  i18next: i18n;
}) => {
  const userStyle = extraStyles[useContext(styleContext)];
  const renderType = useContext(renderingContext);
  const { t: translateHook } = useTranslation();
  return (
    <View>
      {props.icon && (
        <Image
          src={props.icon}
          style={
            userStyle[
              renderType === RenderingContexts.Html ? "iconHtml" : "icon"
            ]
          }
          data-testid={"icon"}
        />
      )}
      <Text style={userStyle["title"]}>{translateHook("invoice")}</Text>
      <View style={userStyle["horizontalFlex"]}>
        <View style={[userStyle["flexbox"], { width: "50%" }]}>
          <Text style={userStyle["h1"]}>{translateHook("to")}</Text>
          <Break height={8} />
          <Party party={props.customerParty["Party"]} />
        </View>
        <Show
          min={Detail.DEFAULT}
          style={[userStyle["flexbox"], { width: "50%" }]}
        >
          <Text style={userStyle["h1"]}>{translateHook("from")}</Text>
          <Break height={8} />
          <Party party={props.supplierParty["Party"]} />
        </Show>
      </View>
    </View>
  );
};

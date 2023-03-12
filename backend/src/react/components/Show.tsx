import React, { useContext } from "react";

import View from "./base/View";
import { extraStyles, styleContext } from "../styles";

/**
 * This component describes a container which allows nested components to be hidden or shown given a LOD value.
 * @param {JSONValue} props - an object containing min and max detail
 */
export const Show = (props) => {
  const userStyle = extraStyles[useContext(styleContext)];

  const inRange =
    (!props.min || props.min <= userStyle["meta"].detail) &&
    (!props.max || userStyle["meta"].detail <= props.max);

  if ((inRange && props.not) || (!inRange && !props.not)) {
    return <View></View>;
  }

  return <View style={props.style}>{props.children}</View>;
};

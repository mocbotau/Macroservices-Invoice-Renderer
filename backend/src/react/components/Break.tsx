import React, { useContext } from "react";
import { DEFAULT_HEIGHT } from "@src/constants";

import View from "./base/View";
import { extraStyles, styleContext } from "../styles";

export const Break = (props: { height?: number; solid?: boolean }) => {
  const userStyle = extraStyles[useContext(styleContext)];

  return (
    <View>
      <View
        style={[
          {
            width: "100%",
            height: props.solid
              ? (props.height || DEFAULT_HEIGHT) / 2
              : props.height || DEFAULT_HEIGHT,
            borderBottomWidth: props.solid ? 2 : 0,
          },
          userStyle["break"],
        ]}
      />
      {props.solid && (
        <View
          style={{
            width: "100%",
            height: (props.height || DEFAULT_HEIGHT) / 2,
          }}
        />
      )}
    </View>
  );
};

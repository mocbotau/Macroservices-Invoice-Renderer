import React from "react";
import { View } from "@react-pdf/renderer";

import { JSONValue } from "@src/interfaces";

const defaultHeight = 16;

export const Break = (props: { height?: number; solid?: boolean }) => {
  return (
    <View>
      <View
        style={{
          width: "100%",
          height: props.solid
            ? (props.height || defaultHeight) / 2
            : props.height || defaultHeight,
          borderBottom: props.solid ? 2 : 0,
        }}
      />
      {props.solid && (
        <View
          style={{
            width: "100%",
            height: (props.height || defaultHeight) / 2,
          }}
        />
      )}
    </View>
  );
};

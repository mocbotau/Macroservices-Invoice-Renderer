import React from "react";
import { View } from "@react-pdf/renderer";
import { DEFAULT_HEIGHT } from "@src/constants";

export const Break = (props: { height?: number; solid?: boolean }) => {
  return (
    <View>
      <View
        style={{
          width: "100%",
          height: props.solid
            ? (props.height || DEFAULT_HEIGHT) / 2
            : props.height || DEFAULT_HEIGHT,
          borderBottom: props.solid ? 2 : 0,
        }}
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

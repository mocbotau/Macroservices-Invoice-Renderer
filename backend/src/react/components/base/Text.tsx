import React, { useContext } from "react";
import RPDF from "@react-pdf/renderer";

import { renderingContext, RenderingContexts } from "./renderingContext";

/**
 * This component defines a basic text field (HTML p tag)
 * @param {JSONValue} props - an object containing the style
 */
const Text = (props) => {
  const renderType = useContext(renderingContext);

  if (renderType === RenderingContexts.Pdf) {
    return (
      <RPDF.Text style={props.style} wrap={props.wrap}>
        {props.children}
      </RPDF.Text>
    );
  } else {
    let styles = Array.isArray(props.style)
      ? props.style.reduce((a, b) => ({ ...a, ...b }))
      : props.style;

    if (!styles) {
      styles = {};
    }
    for (const dir of ["", "Top", "Bottom", "Left", "Right"]) {
      if (styles[`border${dir}Width`] && styles.borderColor) {
        styles[`border${dir}`] = `${styles[`border${dir}Width`]}px solid ${
          styles.borderColor
        }`;
      }
    }
    if (styles.fontFamily === "Helvetica-Bold") {
      delete styles["fontFamily"];
      styles.fontWeight = "bold";
    }
    if (styles.fontFamily === "Helvetica-Oblique") {
      delete styles["fontFamily"];
      styles.fontStyle = "oblique";
    }
    if (!styles.margin) {
      styles.margin = 0;
    }
    if (styles.textAlign === "right") {
      styles.justifyContent = "flex-end";
    }
    return <p style={styles}>{props.children}</p>;
  }
};

export default Text;

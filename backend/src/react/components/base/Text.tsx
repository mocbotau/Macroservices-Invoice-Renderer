import React, { useContext } from "react";
import RPDF from "@react-pdf/renderer";

import { renderingContext, RenderingContexts } from "./renderingContext";

const Text = (props) => {
  const renderType = useContext(renderingContext);

  if (renderType === RenderingContexts.Pdf) {
    return <RPDF.Text style={props.style}>{props.children}</RPDF.Text>;
  } else {
    let styles = Array.isArray(props.style)
      ? props.style.reduce((a, b) => ({ ...a, ...b }))
      : props.style;

    if (!styles) {
      styles = {};
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

    return <p style={styles}>{props.children}</p>;
  }
};

export default Text;

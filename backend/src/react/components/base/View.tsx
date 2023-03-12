import React, { useContext } from "react";
import RPDF from "@react-pdf/renderer";

import { renderingContext, RenderingContexts } from "./renderingContext";

/**
 * This component defines a container to hold information (HTML div)
 */
const View = (props) => {
  const renderType = useContext(renderingContext);

  if (renderType === RenderingContexts.Pdf) {
    return <RPDF.View style={props.style}>{props.children}</RPDF.View>;
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

    if (styles.flexDirection && !styles.display) {
      styles.display = "flex";
    }

    return <div style={styles}>{props.children}</div>;
  }
};

export default View;

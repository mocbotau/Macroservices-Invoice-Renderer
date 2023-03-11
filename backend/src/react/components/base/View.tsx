import React, { useContext } from "react";
import RPDF from "@react-pdf/renderer";

import { renderingContext, RenderingContexts } from "./renderingContext";

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
    if (styles.borderWidth && styles.borderColor) {
      styles.border = `${styles.borderWidth}px solid ${styles.borderColor}`;
    }
    if (styles.flexDirection && !styles.display) {
      styles.display = "flex";
    }

    return <div style={styles}>{props.children}</div>;
  }
};

export default View;

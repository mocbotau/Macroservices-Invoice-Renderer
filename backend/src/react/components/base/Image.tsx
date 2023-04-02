import React, { useContext } from "react";
import { Image as RPDFImage } from "@react-pdf/renderer";

import { renderingContext, RenderingContexts } from "./renderingContext";

/**
 * This component defines an image field (HTML img tag)
 * @param {JSONValue} props - an object containing the source, style and test ID
 */
const Image = (props: { src: string; style?: object }) => {
  const renderType = useContext(renderingContext);

  if (renderType === RenderingContexts.Pdf) {
    return (
      <RPDFImage
        src={Buffer.from(props.src, "base64")}
        style={props.style}
        data-testid={props["data-testid"]}
      />
    );
  } else {
    let styles = Array.isArray(props.style)
      ? props.style.reduce((a, b) => ({ ...a, ...b }))
      : props.style;

    if (!styles) {
      styles = {};
    }
    if (!styles.margin) {
      styles.margin = 0;
    }
    return <img src={props.src} style={styles} />;
  }
};

export default Image;

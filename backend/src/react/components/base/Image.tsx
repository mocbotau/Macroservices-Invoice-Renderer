import React, { useContext } from "react";
import { Image as RPDFImage } from "@react-pdf/renderer";

import { renderingContext, RenderingContexts } from "./renderingContext";

/**
 * This component defines an image field (HTML img tag)
 * @param {JSONValue} props - an object containing the source, style and test ID
 */
const Image = (props: { src: Buffer; style?: object }) => {
  const renderType = useContext(renderingContext);

  if (renderType === RenderingContexts.Pdf) {
    console.log(props);
    return (
      <RPDFImage
        src={props.src}
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
    return (
      <img src={URL.createObjectURL(new Blob([props.src]))} style={styles} />
    );
  }
};

export default Image;

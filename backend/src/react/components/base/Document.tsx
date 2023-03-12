import React, { useContext } from "react";
import RPDF from "@react-pdf/renderer";

import { renderingContext, RenderingContexts } from "./renderingContext";

/**
 * This component forms a base for the invoice.
 */
const Document = (props) => {
  const renderType = useContext(renderingContext);

  if (renderType === RenderingContexts.Pdf) {
    return <RPDF.Document>{props.children}</RPDF.Document>;
  } else {
    return <html style={{ "display": "flex" }}>{props.children}</html>;
  }
};

export default Document;

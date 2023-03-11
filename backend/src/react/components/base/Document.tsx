import React, { useContext } from "react";
import RPDF from "@react-pdf/renderer";

import { renderingContext, RenderingContexts } from "./renderingContext";

const Document = ({ children }) => {
  const renderType = useContext(renderingContext);

  if (renderType === RenderingContexts.Pdf) {
    return <RPDF.Document>{children}</RPDF.Document>;
  } else {
    return <html style={{ "display": "flex" }}>{children}</html>;
  }
};

export default Document;

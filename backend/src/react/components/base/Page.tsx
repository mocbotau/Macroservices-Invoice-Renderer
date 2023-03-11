import React, { useContext } from "react";
import RPDF from "@react-pdf/renderer";

import { renderingContext, RenderingContexts } from "./renderingContext";
import { INNER_WIDTH } from "@src/react/styles";

const Page = ({ children, size }) => {
  const renderType = useContext(renderingContext);

  if (renderType === RenderingContexts.Pdf) {
    return <RPDF.Page size={size}>{children}</RPDF.Page>;
  } else {
    return (
      <body style={{ margin: "auto", width: INNER_WIDTH }}>{children}</body>
    );
  }
};

export default Page;

import React, { useContext } from "react";
import RPDF from "@react-pdf/renderer";

import { renderingContext, RenderingContexts } from "./renderingContext";
import { INNER_WIDTH } from "@src/constants";

const Page = (props) => {
  const renderType = useContext(renderingContext);

  if (renderType === RenderingContexts.Pdf) {
    return <RPDF.Page size={props.size}>{props.children}</RPDF.Page>;
  } else {
    return (
      <body style={{ margin: "auto", width: INNER_WIDTH }}>
        {props.children}
      </body>
    );
  }
};

export default Page;

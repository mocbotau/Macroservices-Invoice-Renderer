import React from "react";

export enum RenderingContexts {
  Pdf,
  Html,
}

export const renderingContext = React.createContext(RenderingContexts.Pdf);

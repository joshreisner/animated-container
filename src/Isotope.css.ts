import { CSSProperties } from "react";

export const gridCSS: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  position: "relative",
};

export const shadowGridCSS: CSSProperties = {
  ...gridCSS,
  opacity: 0.25,
  position: "absolute",
  width: "100%",
};

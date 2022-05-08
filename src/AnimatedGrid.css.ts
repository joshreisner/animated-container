import { CSSProperties } from "react";

export const grid: CSSProperties = {
  alignContent: "start",
  backgroundColor: "palegoldenrod",
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  position: "relative",
  transitionProperty: "height",
  transitionTimingFunction: "ease",
};

export const shadowGrid: CSSProperties = {
  ...grid,
  opacity: 0,
  backgroundColor: "pink",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  zIndex: -10,
};

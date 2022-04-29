export const all = "All";

export const colors = [
  "DarkSlateBlue",
  "LightSlateGray",
  "RebeccaPurple",
  "SeaGreen",
  "Tomato",
];

export const data = [...Array(40)].map(
  () => colors[Math.floor(Math.random() * colors.length)]
);

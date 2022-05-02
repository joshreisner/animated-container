export const all = "All";

export const colors = [
  "DarkSlateBlue",
  "LightSlateGray",
  "RebeccaPurple",
  "SeaGreen",
  "Tomato",
];

export const data = [...Array(40)].map(() => ({
  id: Math.random().toString(36).slice(2),
  color: colors[Math.floor(Math.random() * colors.length)],
}));

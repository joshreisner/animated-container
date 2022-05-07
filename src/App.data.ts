export const all = "All";

export const colors = ["DarkSlateBlue", "LightSlateGray", "SeaGreen"];

export const values = ["✈️", "👍", "❤️"];

export const data = [...Array(36)].map(() => ({
  id: Math.random().toString(36).slice(2),
  color: colors[Math.floor(Math.random() * colors.length)],
  value: values[Math.floor(Math.random() * values.length)],
}));

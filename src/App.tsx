import { useState } from "react";
import styled from "styled-components";

export default function App() {
  const all = "All",
    colors = [
      "DarkSlateBlue",
      "LightSlateGray",
      "RebeccaPurple",
      "SeaGreen",
      "Tomato",
    ];
  const [selected, setSelected] = useState(all);
  const data = [...Array(40)].map(
    () => colors[Math.floor(Math.random() * colors.length)]
  );
  const filtered = data.filter((color) => [all, color].includes(selected));

  return (
    <Container>
      <Colors>
        {[all, ...colors].map((color, index) => (
          <button
            className={selected === color ? "selected" : undefined}
            key={index}
            onClick={() => setSelected(color)}
          >
            {color}
          </button>
        ))}
      </Colors>
      <Grid>
        {filtered.map((color, index) => (
          <div key={index} style={{ backgroundColor: color }}>
            {color}
          </div>
        ))}
      </Grid>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  gap: 1rem;
  margin: 100px auto;
  max-width: 1200px;
`;

const Colors = styled.nav`
  display: flex;
  gap: 1rem;
  button {
    background-color: white;
    border: 1px solid black;
    cursor: pointer;
    padding: 0.5rem 1rem;
    &.selected {
      background-color: black;
      color: white;
    }
  }
`;

const Grid = styled.div`
  color: white;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  > div {
    align-items: center;
    display: flex;
    height: 7rem;
    justify-content: center;
    width: calc(25% - 0.75rem);
  }
`;

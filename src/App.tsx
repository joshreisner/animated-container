import { useState } from "react";

import Isotope from "./Isotope";
import { Container, Filter, Item } from "./App.styles";
import { all, colors, data } from "./App.data";

export default function App() {
  const [selected, setSelected] = useState(all);

  return (
    <Container>
      <Filter>
        {[all, ...colors].map((color, index) => (
          <button
            className={selected === color ? "selected" : undefined}
            key={index}
            onClick={() => setSelected(color)}
          >
            {color}
          </button>
        ))}
      </Filter>
      <Isotope gap="1rem">
        {data
          .filter((item) => [all, item].includes(selected))
          .map((color, index) => (
            <Item key={index} style={{ backgroundColor: color }}>
              {color}
            </Item>
          ))}
      </Isotope>
    </Container>
  );
}

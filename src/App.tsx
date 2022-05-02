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
      <Isotope>
        {data
          .filter((item) => [all, item.color].includes(selected))
          .map((item) => (
            <Item key={item.id} style={{ backgroundColor: item.color }}>
              {item.color}
            </Item>
          ))}
      </Isotope>
    </Container>
  );
}

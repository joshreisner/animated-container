import { useState } from "react";

import { Container, Filter, GridWrapper, Item } from "./App.styles";
import { all, colors, values, data } from "./App.data";
import AnimatedContainer from "./AnimatedContainer";

export default function App() {
  const [selected, setSelected] = useState(all);

  return (
    <Container>
      <Filter>
        {[all, ...colors, ...values].map((value, index) => (
          <button
            className={selected === value ? "selected" : undefined}
            key={index}
            onClick={() => setSelected(value)}
          >
            {value}
          </button>
        ))}
      </Filter>
      <GridWrapper>
        <AnimatedContainer>
          {data
            .filter((item) =>
              ["All", item.value, item.color].includes(selected)
            )
            .map((item) => (
              <Item key={item.id} style={{ backgroundColor: item.color }}>
                {item.value}
              </Item>
            ))}
        </AnimatedContainer>
      </GridWrapper>
    </Container>
  );
}

import { useEffect, useRef, useState } from "react";

import { Container, Filter, Grid, Item } from "./App.styles";
import { all, colors, values, data } from "./App.data";

export default function App() {
  const [selected, setSelected] = useState(all);
  const [status, setStatus] = useState<{
    adding: string[];
    moving: string[];
    removing: string[];
    showing: string[];
    transitioning: boolean;
  }>({
    adding: [],
    moving: [],
    removing: [],
    showing: data.map((child) => child.id),
    transitioning: false,
  });

  const timer = useRef<NodeJS.Timeout | null>(null);
  const items = useRef<HTMLDivElement[]>([]);
  const animationTime: number = 500;

  useEffect(() => {
    const newIds = data
      .filter((item) => [all, item.color, item.value].includes(selected))
      .map((child) => child.id);

    //stop if no changes
    if (
      newIds.length === status.showing.length &&
      status.showing.every((item) => newIds.indexOf(item) > -1)
    )
      return;

    const adding = newIds.filter(
      (childId) => !status.showing.includes(childId)
    );
    const moving = newIds.filter((childId) => status.showing.includes(childId));
    const removing = status.showing.filter(
      (childId) => !newIds.includes(childId)
    );

    console.log({
      adding,
      moving,
      removing,
    });

    setStatus({
      adding,
      moving,
      removing,
      showing: newIds,
      transitioning: true,
    });

    items.current.forEach((item) => {
      const { height, width, top, left } = item.getBoundingClientRect();
      item.style.height = `${height}px`;
      item.style.left = `${left}px`;
      item.style.top = `${top}px`;
      item.style.width = `${width}px`;
    });

    //settimeout
    if (timer.current) {
      console.log("clearing the timer in useEffect", timer.current);
      clearTimeout(timer.current);
    }

    console.log("setting the timer");

    timer.current = setTimeout(() => {
      console.log("resetting");
      items.current.forEach((item) => {
        item.style.height = "auto";
        item.style.left = "auto";
        item.style.top = "auto";
        item.style.width = "auto";
      });
      setStatus({
        adding: [],
        moving: [],
        removing: [],
        showing: newIds,
        transitioning: false,
      });
    }, animationTime);

    return () => {
      if (timer.current) {
        console.log("clearing the timer on useEffect unload", timer.current);
        clearTimeout(timer.current);
      }
    };
  }, [status, selected]);

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
      <Grid>
        {data.map((item, index) => (
          <Item
            animationTime={animationTime}
            key={item.id}
            style={{ backgroundColor: item.color }}
            className={cx({
              adding: status.adding.includes(item.id),
              moving: status.moving.includes(item.id),
              removing: status.adding.includes(item.id),
              transitioning: status.transitioning,
            })}
            ref={(el: HTMLDivElement) => (items.current[index] = el)}
          >
            {item.value}
          </Item>
        ))}
      </Grid>
    </Container>
  );
}

function cx(obj: Record<string, boolean>) {
  return Object.keys(obj)
    .filter((key) => !!obj[key])
    .join(" ");
}

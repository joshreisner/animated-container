import { useEffect, useRef, useState, cloneElement } from "react";

import { grid, shadowGrid } from "./AnimatedGrid.css";

type AnimatedGridProps = {
  animationTime?: number;
  gap?: string;
  children: JSX.Element[];
};

type Lookup = {
  [id: string]: {
    height: number;
    width: number;
    top: number;
    left: number;
  };
};

export default function AnimatedGrid({
  animationTime = 400,
  gap = "1rem",
  children,
}: AnimatedGridProps) {
  const [buffer, setBuffer] = useState<JSX.Element[]>();
  const [height, setHeight] = useState<number>();

  const animationEnd = useRef<NodeJS.Timeout | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const childrenRef = useRef<Lookup>({});

  //watch children for changes
  useEffect(() => {
    if (!buffer) {
      setBuffer(children);
      return;
    } else if (buffer === children) {
      return;
    }

    //calculate which keys are being added, moved, or removed
    const newKeys = children.map((child) => child.key);
    const oldKeys = buffer.map((child) => child.key);
    const adding = newKeys.filter((childId) => !oldKeys.includes(childId));
    const moving = newKeys.filter((childId) => oldKeys.includes(childId));
    const removing = oldKeys.filter((childId) => !newKeys.includes(childId));

    //new height
    setHeight(shadowRef.current?.getBoundingClientRect().height);

    Object.keys(childrenRef.current).forEach((child) => {
      console.log(child);
      //console.log(childrenRef.current[child].getBoundingClientRect());
    });

    console.log(
      [
        `adding ${adding.length}`,
        `moving ${moving.length}`,
        `removing ${removing.length}`,
        `height will be ${height}`,
      ].join(", ")
    );

    if (animationEnd.current) {
      clearTimeout(animationEnd.current);
    }

    animationEnd.current = setTimeout(() => setBuffer(children), animationTime);

    return () => {
      if (animationEnd.current) {
        clearTimeout(animationEnd.current);
      }
    };
  }, [children, animationTime, buffer, height]);

  return (
    <div
      style={{ ...grid, gap, height, transitionDuration: `${animationTime}ms` }}
    >
      {buffer}
      {buffer && (
        <div style={{ ...shadowGrid, gap }} ref={shadowRef}>
          {children.map((child) =>
            cloneElement(child, {
              ref: (ref: HTMLDivElement) => {
                if (child.key) {
                  childrenRef.current[child.key] = ref.getBoundingClientRect();
                }
              },
            })
          )}
        </div>
      )}
    </div>
  );
}

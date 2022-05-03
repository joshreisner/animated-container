import { useEffect, useRef, useState } from "react";

import { grid, shadowGrid } from "./AnimatedGrid.css";

type AnimatedGridProps = {
  animationTime?: number;
  gap?: string;
  children: JSX.Element[];
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
          {children}
        </div>
      )}
    </div>
  );
}

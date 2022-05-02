import { useEffect, useRef, useState } from "react";

import { gridCSS, shadowGridCSS } from "./Isotope.css";

type IsotopeProps = {
  animationTime?: 500;
  gap?: string;
  children: JSX.Element[];
};

export default function Isotope({
  animationTime = 500,
  gap = "1rem",
  children,
}: IsotopeProps) {
  const [buffer, setBuffer] = useState<JSX.Element[]>();

  const animationEnd = useRef<NodeJS.Timeout>();

  //watch children for changes
  useEffect(() => {
    if (!buffer) {
      setBuffer(children);
      return;
    } else if (buffer === children) {
      return;
    }

    const newIds = children.map((child) => child.key);
    const oldIds = buffer.map((child) => child.key);
    const adding = newIds.filter((childId) => !oldIds.includes(childId));
    const moving = newIds.filter((childId) => oldIds.includes(childId));
    const removing = oldIds.filter((childId) => !newIds.includes(childId));

    console.log(
      `adding ${adding.length}`,
      `moving ${moving.length}`,
      `removing ${removing.length}`
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
  }, [children, animationTime, buffer]);

  return (
    <div style={{ ...gridCSS, gap }}>
      {buffer}
      {buffer && (
        <div
          style={{
            ...shadowGridCSS,
            gap,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

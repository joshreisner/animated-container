import { CSSProperties, useEffect, useRef, useState } from "react";

import { grid, shadowGrid } from "./AnimatedGrid.css";

export default function AnimatedGrid({
  animationTime = 600,
  gap = "1rem",
  children,
}: {
  animationTime?: number;
  gap?: string;
  children: JSX.Element[];
}) {
  const transition = `all ${animationTime}ms ease`;

  const [buffer, setBuffer] = useState<{
    keys: string[];
    children: JSX.Element[];
    styles: { [key: string]: CSSProperties };
    status: "initializing" | "ready" | "changing" | "running";
    gridStyle: CSSProperties;
  }>({
    keys: [],
    children: [],
    styles: {},
    status: "initializing",
    gridStyle: {
      ...grid,
      gap,
      transition,
    },
  });

  //parent grid ref
  const gridRef = useRef<HTMLDivElement | null>(null);

  //parent grid ref
  const shadowGridRef = useRef<HTMLDivElement | null>(null);

  //timer
  const timer = useRef<NodeJS.Timeout | null>(null);

  //visible buffered children wrappers
  const elements = useRef<{ [key: string]: HTMLDivElement | null }>({});

  //hidden unbuffered children wrappers
  const shadowElements = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    //get keys from children
    const keys: string[] = children.map((child) => child.key?.toString() ?? "");

    //stop if no changes
    if (keys.join() === buffer.keys.join()) return;

    //identify what needs to happen
    const changes = {
      adding: keys.filter((key) => !buffer.keys.includes(key)),
      moving: keys.filter((key) => buffer.keys.includes(key)),
      removing: buffer.keys.filter((key) => !keys.includes(key)),
    };

    console.log(buffer.status);

    if (buffer.status === "initializing") {
      //set children with no animation
      setBuffer({ ...buffer, status: "ready", keys, children });
    } else if (buffer.status === "ready") {
      //freeze parent style
      const gridRect = gridRef.current?.getBoundingClientRect();

      const gridStyle = {
        ...buffer.gridStyle,
        height: gridRect?.height,
      };

      //freeze child styles
      const styles: { [key: string]: CSSProperties } = {};
      buffer.keys.forEach((key) => {
        const css = elements.current[key]?.getBoundingClientRect();
        styles[key] = {
          position: "absolute",
          height: css?.height,
          width: css?.width,
          top: css?.top ? css.top - (gridRect?.top || 0) : undefined,
          left: css?.left ? css.left - (gridRect?.left || 0) : undefined,
        };
      });

      //add new elements
      const newElements = children.filter(
        (child) => child.key && changes.adding.includes(child.key?.toString())
      );

      changes.adding.forEach((key) => {
        const target = shadowElements.current[key]?.getBoundingClientRect();
        styles[key] = {
          position: "absolute",
          height: target?.height,
          width: target?.width,
          opacity: 0,
          transform: "scale(0)",
          top: target?.top ? target.top - (gridRect?.top || 0) : undefined,
          left: target?.left ? target.left - (gridRect?.left || 0) : undefined,
        };
      });

      setBuffer({
        ...buffer,
        status: "changing",
        styles,
        gridStyle,
        children: [...buffer.children, ...newElements],
      });
    } else if (buffer.status === "changing") {
      const shadowGridRect = shadowGridRef.current?.getBoundingClientRect();

      const gridStyle = {
        ...buffer.gridStyle,
        height: shadowGridRect?.height,
        transition,
      };

      const styles: { [key: string]: CSSProperties } = {};

      changes.moving.forEach((key) => {
        if (!shadowElements.current[key]) return;
        const target = shadowElements.current[key]?.getBoundingClientRect();
        styles[key] = {
          ...buffer.styles[key],
          transition,
          top: target?.top
            ? target.top - (shadowGridRect?.top || 0)
            : undefined,
          left: target?.left
            ? target.left - (shadowGridRect?.left || 0)
            : undefined,
        };
      });

      changes.removing.forEach((key) => {
        styles[key] = {
          ...buffer.styles[key],
          transition,
          transform: "scale(0)",
          opacity: 0,
        };
      });

      changes.adding.forEach((key) => {
        styles[key] = {
          ...buffer.styles[key],
          transition,
          opacity: 1,
          transform: "scale(1)",
        };
      });

      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        setBuffer({
          status: "ready",
          styles: {},
          gridStyle: { ...buffer.gridStyle, height: undefined },
          children,
          keys,
        });
      }, animationTime);

      setBuffer({ ...buffer, status: "running", styles, gridStyle });
    }
  }, [buffer, children, transition, animationTime]);

  return (
    <div
      ref={gridRef}
      style={{
        ...buffer.gridStyle,
      }}
    >
      {buffer.children.map((child) => (
        <div
          key={child.key}
          ref={(el) => {
            if (!child.key) return;
            elements.current[child.key] = el;
          }}
          style={child.key ? buffer.styles[child.key] : undefined}
        >
          {child}
        </div>
      ))}
      <div ref={shadowGridRef} style={{ ...shadowGrid, gap }}>
        {children.map((child) => (
          <div
            key={child.key}
            ref={(el) => {
              if (!child.key) return;
              shadowElements.current[child.key] = el;
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

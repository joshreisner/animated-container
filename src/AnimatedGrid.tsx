import { CSSProperties, useEffect, useRef, useState } from "react";

export default function AnimatedGrid({
  animationTime = 600,
  gap = "1rem",
  children,
  style,
}: {
  animationTime?: number;
  gap?: string;
  children: JSX.Element[];
  style?: CSSProperties;
}) {
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
      ...style,
      gap,
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

    const transition = `all ${animationTime}ms`;

    const styles: { [key: string]: CSSProperties } = {};

    if (buffer.status === "initializing") {
      //set children with no animation
      setBuffer({ ...buffer, status: "ready", keys, children });
    } else if (buffer.status === "ready") {
      //freeze parent style
      const { height, top, left } =
        gridRef.current?.getBoundingClientRect() ?? {
          left: 0,
          top: 0,
        };

      //freeze child styles
      buffer.keys.forEach((key) => {
        const css = elements.current[key]?.getBoundingClientRect();
        styles[key] = {
          height: css?.height,
          left: css ? css.left - left : undefined,
          position: "absolute",
          top: css ? css.top - top : undefined,
          width: css?.width,
        };
      });

      //add new elements
      const newElements = children.filter(
        (child) => child.key && changes.adding.includes(child.key?.toString())
      );

      changes.adding.forEach((key) => {
        styles[key] = {
          opacity: 0,
          position: "absolute",
          transform: "scale(0)",
        };
      });

      setBuffer({
        ...buffer,
        children: [...buffer.children, ...newElements],
        gridStyle: { ...buffer.gridStyle, height, position: "relative" },
        status: "changing",
        styles,
      });
    } else if (buffer.status === "changing") {
      const { height, top, left } =
        shadowGridRef.current?.getBoundingClientRect() ?? {
          left: 0,
          top: 0,
        };

      changes.moving.forEach((key) => {
        if (!shadowElements.current[key]) return;
        const target = shadowElements.current[key]?.getBoundingClientRect();
        styles[key] = {
          ...buffer.styles[key],
          left: target?.left ? target.left - left : undefined,
          top: target?.top ? target.top - top : undefined,
          transition,
        };
      });

      changes.removing.forEach((key) => {
        styles[key] = {
          ...buffer.styles[key],
          opacity: 0,
          transform: "scale(0)",
          transition,
        };
      });

      changes.adding.forEach((key) => {
        const target = shadowElements.current[key]?.getBoundingClientRect();
        styles[key] = {
          ...buffer.styles[key],
          height: target?.height,
          top: target ? target.top - top : undefined,
          left: target ? target.left - left : undefined,
          width: target?.width,
          opacity: 1,
          transform: "scale(1)",
          transition,
        };
      });

      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        setBuffer({
          children,
          gridStyle: { ...buffer.gridStyle, height: undefined },
          keys,
          status: "ready",
          styles: {},
        });
      }, animationTime);

      setBuffer({
        ...buffer,
        gridStyle: { ...buffer.gridStyle, height, transition },
        status: "running",
        styles,
      });
    }
  }, [buffer, children, animationTime]);

  //clean up
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return (
    <div ref={gridRef} style={buffer.gridStyle}>
      {buffer.children.map((child) => (
        <div
          key={child.key}
          ref={(el) => child.key && (elements.current[child.key] = el)}
          style={child.key ? buffer.styles[child.key] : undefined}
        >
          {child}
        </div>
      ))}
      {buffer.status === "changing" && (
        <div ref={shadowGridRef} style={{ ...shadowGrid, gap }}>
          {children.map((child) => (
            <div
              key={child.key}
              ref={(el) =>
                child.key && (shadowElements.current[child.key] = el)
              }
            >
              {child}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const grid: CSSProperties = {
  alignContent: "start",
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
};

const shadowGrid: CSSProperties = {
  ...grid,
  opacity: 0,
  position: "absolute",
  top: 0,
  width: "100%",
  zIndex: -10,
};

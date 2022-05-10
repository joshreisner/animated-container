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
    children: JSX.Element[];
    gridStyle: CSSProperties;
    keys: string[];
    status: "initializing" | "ready" | "changing" | "running";
    styles: { [key: string]: CSSProperties };
  }>({
    children: [],
    gridStyle: {
      ...grid,
      ...style,
      gap,
    },
    keys: [],
    status: "initializing",
    styles: {},
  });

  //visible buffered children wrappers
  const gridDivs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  //parent grid ref
  const gridRef = useRef<HTMLDivElement | null>(null);

  //hidden unbuffered children wrappers
  const shadowDivs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  //"shadow" grid that transparently materializes when a change occurs
  const shadowRef = useRef<HTMLDivElement | null>(null);

  //timer to run cleanup callback after animation finishes
  const timer = useRef<NodeJS.Timeout | null>(null);

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

    //lookup object containing css for gridDivs
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
        const css = gridDivs.current[key]?.getBoundingClientRect();
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
        shadowRef.current?.getBoundingClientRect() ?? {
          left: 0,
          top: 0,
        };

      changes.adding.forEach((key) => {
        const target = shadowDivs.current[key]?.getBoundingClientRect();
        styles[key] = {
          ...buffer.styles[key],
          height: target?.height,
          left: target ? target.left - left : undefined,
          opacity: 1,
          top: target ? target.top - top : undefined,
          transform: "scale(1)",
          transition: `opacity ${animationTime}ms, transform ${animationTime}ms`,
          width: target?.width,
        };
      });

      changes.moving.forEach((key) => {
        if (!shadowDivs.current[key]) return;
        const target = shadowDivs.current[key]?.getBoundingClientRect();
        styles[key] = {
          ...buffer.styles[key],
          left: target?.left ? target.left - left : undefined,
          top: target?.top ? target.top - top : undefined,
          transition: `left ${animationTime}ms, top ${animationTime}ms`,
        };
      });

      changes.removing.forEach((key) => {
        styles[key] = {
          ...buffer.styles[key],
          opacity: 0,
          transform: "scale(0)",
          transition: `opacity ${animationTime}ms, transform ${animationTime}ms`,
        };
      });

      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        setBuffer({
          children,
          gridStyle: {
            ...buffer.gridStyle,
            height: undefined,
            position: undefined,
          },
          keys,
          status: "ready",
          styles: {},
        });
      }, animationTime);

      setBuffer({
        ...buffer,
        gridStyle: {
          ...buffer.gridStyle,
          height,
          transition: `height ${animationTime}ms`,
        },
        status: "running",
        styles,
      });
    }
  }, [animationTime, buffer, children]);

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
          ref={(el) => child.key && (gridDivs.current[child.key] = el)}
          style={child.key ? buffer.styles[child.key] : undefined}
        >
          {child}
        </div>
      ))}
      {buffer.status === "changing" && (
        <div ref={shadowRef} style={{ ...shadow, gap }}>
          {children.map((child) => (
            <div
              key={child.key}
              ref={(el) => child.key && (shadowDivs.current[child.key] = el)}
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

const shadow: CSSProperties = {
  ...grid,
  opacity: 0,
  position: "absolute",
  top: 0,
  width: "100%",
  zIndex: -10,
};

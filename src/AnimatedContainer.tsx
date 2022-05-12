import { CSSProperties, useEffect, useRef, useState } from "react";

export default function AnimatedContainer({
  time = 600,
  children,
  style,
}: {
  time?: number;
  children: JSX.Element[];
  style?: CSSProperties;
}) {
  const [buffer, setBuffer] = useState<{
    children: JSX.Element[];
    height?: number;
    keys: string[];
    shadowStyles: CSSProperties;
    status: "initializing" | "ready" | "changing" | "running";
    styles: { [key: string]: CSSProperties };
  }>({
    children: [],
    keys: [],
    shadowStyles: {},
    status: "initializing",
    styles: {},
  });

  //visible buffered children wrappers
  const containerDivs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  //parent container ref
  const containerRef = useRef<HTMLDivElement | null>(null);

  //hidden unbuffered children wrappers
  const shadowDivs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  //"shadow" container that transparently materializes when a change occurs
  const shadowRef = useRef<HTMLDivElement | null>(null);

  //timer to run cleanup callback after animation finishes
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    //lookup object containing css for containerDivs
    const styles: { [key: string]: CSSProperties } = {};

    if (buffer.status === "initializing") {
      //set children with no animation
      setBuffer({ ...buffer, status: "ready", keys, children });
    } else if (buffer.status === "ready") {
      //freeze parent style
      const { height, top, left } =
        containerRef.current?.getBoundingClientRect() ?? {
          left: 0,
          top: 0,
        };

      //freeze child styles
      buffer.keys.forEach((key) => {
        const css = containerDivs.current[key]?.getBoundingClientRect();
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

      //make sure new elements are hidden
      changes.adding.forEach((key) => {
        styles[key] = {
          opacity: 0,
          position: "absolute",
          transform: "scale(0)",
        };
      });

      //style the shadow
      let shadowStyles: CSSProperties = {
        opacity: 0,
        position: "absolute",
        top: 0,
        zIndex: -10,
      };

      //copy layout styles from container to shadow
      if (containerRef.current) {
        const elementStyles = window.getComputedStyle(containerRef.current);
        const containerStyles = {
          alignContent: elementStyles.getPropertyValue("align-content"),
          alignItems: elementStyles.getPropertyValue("align-items"),
          columnGap: elementStyles.getPropertyValue("column-gap"),
          display: elementStyles.getPropertyValue("display"),
          flexDirection: elementStyles.getPropertyValue("flex-direction"),
          flexFlow: elementStyles.getPropertyValue("flex-flow"),
          flexWrap: elementStyles.getPropertyValue("flex-wrap"),
          gap: elementStyles.getPropertyValue("gap"),
          grid: elementStyles.getPropertyValue("grid"),
          gridAutoColumns: elementStyles.getPropertyValue("grid-auto-columns"),
          gridAutoFlow: elementStyles.getPropertyValue("grid-auto-flow"),
          gridAutoRows: elementStyles.getPropertyValue("grid-auto-rows"),
          gridTemplate: elementStyles.getPropertyValue("grid-template"),
          gridTemplateAreas: elementStyles.getPropertyValue(
            "grid-template-areas"
          ),
          gridTemplateColumns: elementStyles.getPropertyValue(
            "grid-template-columns"
          ),
          //gridTemplateRows: elementStyles.getPropertyValue("grid-template-rows"),
          justifyContent: elementStyles.getPropertyValue("justify-content"),
          justifyItems: elementStyles.getPropertyValue("justify-items"),
          placeContent: elementStyles.getPropertyValue("place-content"),
          placeItems: elementStyles.getPropertyValue("place-items"),
          rowGap: elementStyles.getPropertyValue("row-gap"),
          width: elementStyles.getPropertyValue("width"),
        } as CSSProperties;
        shadowStyles = { ...shadowStyles, ...containerStyles };
      }

      setBuffer({
        ...buffer,
        children: [...buffer.children, ...newElements],
        height,
        shadowStyles,
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
          transition: `opacity ${time}ms, transform ${time}ms`,
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
          transition: `left ${time}ms, top ${time}ms`,
        };
      });

      changes.removing.forEach((key) => {
        styles[key] = {
          ...buffer.styles[key],
          opacity: 0,
          transform: "scale(0)",
          transition: `opacity ${time}ms, transform ${time}ms`,
        };
      });

      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        setBuffer({
          children,
          height: undefined,
          keys,
          shadowStyles: {},
          status: "ready",
          styles: {},
        });
      }, time);

      setBuffer({
        ...buffer,
        height,
        status: "running",
        styles,
      });
    }
  }, [time, buffer, children]);

  //clean up
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        ...style,
        height: buffer.height,
        position: "relative",
        transition: `height ${time}ms`,
      }}
    >
      {buffer.children.map((child) => (
        <div
          key={child.key}
          ref={(el) => child.key && (containerDivs.current[child.key] = el)}
          style={child.key ? buffer.styles[child.key] : undefined}
        >
          {child}
        </div>
      ))}
      {buffer.status === "changing" && (
        <div ref={shadowRef} style={{ ...buffer.shadowStyles }}>
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

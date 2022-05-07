import { grid } from "./AnimatedGrid.css";

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
  return (
    <div style={{ ...grid, gap, transitionDuration: `${animationTime}ms` }}>
      {children}
    </div>
  );
}

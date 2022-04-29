import { useEffect } from "react";

type IsotopeProps = {
  gap: string;
  children: React.ReactNode;
};

export default function Isotope({ gap, children }: IsotopeProps) {
  //watch for changes
  useEffect(() => {
    console.log(children);
  }, [children]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap }}>{children}</div>
  );
}

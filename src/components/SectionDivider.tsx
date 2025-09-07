import React from "react";

type Props = {
  angle?: "left" | "right";
  gradientFrom?: string; // tailwind color or hex
  gradientTo?: string;
  className?: string;
};

export default function SectionDivider({ angle = "left", gradientFrom = "#FFF1F1", gradientTo = "transparent", className = "" }: Props) {
  const clip = angle === "left" ? "polygon(0 0, 100% 0, 100% 100%, 0 85%)" : "polygon(0 0, 100% 0, 100% 85%, 0 100%)";
  return (
    <div
      className={className}
      style={{
        background: `linear-gradient(180deg, ${gradientFrom}, ${gradientTo})`,
        clipPath: clip,
        height: "80px",
        width: "100%",
      }}
    />
  );
}
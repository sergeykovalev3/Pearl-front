import type { ComponentPropsWithoutRef } from "react";

export type CarouselChevronIconProps = Omit<
  ComponentPropsWithoutRef<"svg">,
  "xmlns" | "viewBox" | "children"
> & {
  direction: "left" | "right";
  size?: number;
};

export function CarouselChevronIcon({
  direction,
  size = 22,
  ...rest
}: CarouselChevronIconProps) {
  const d =
    direction === "right" ? "M10 7l5 5-5 5" : "M14 7l-5 5 5 5";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...rest}
    >
      <path
        d={d}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

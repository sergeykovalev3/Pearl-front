import type { ComponentPropsWithoutRef } from "react";

export type MinusIconProps = Omit<
  ComponentPropsWithoutRef<"svg">,
  "xmlns" | "viewBox" | "children"
> & {
  size?: number;
};

export function MinusIcon({
  size = 20,
  className,
  stroke = "currentColor",
  ...rest
}: MinusIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden
      {...rest}
    >
      <circle cx="10" cy="10" r="9" stroke={stroke} strokeWidth={2} />
      <line
        x1="6"
        y1="9.89844"
        x2="14"
        y2="9.89844"
        stroke={stroke}
        strokeWidth={2}
      />
    </svg>
  );
}

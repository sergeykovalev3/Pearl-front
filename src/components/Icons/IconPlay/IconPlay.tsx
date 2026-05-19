import type { ComponentPropsWithoutRef } from "react";

export type IconPlayProps = Omit<
  ComponentPropsWithoutRef<"svg">,
  "xmlns" | "viewBox" | "children"
> & {
  size?: number;
};

export function IconPlay({ size = 52, className, ...rest }: IconPlayProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...rest}
    >
      <circle cx={26} cy={26} r={25} stroke="currentColor" strokeWidth={2} />
      <path d="M22 17L35 26L22 35V17Z" fill="currentColor" />
    </svg>
  );
}

import type { ComponentPropsWithoutRef } from "react";

export type StarIconProps = Omit<
  ComponentPropsWithoutRef<"svg">,
  "xmlns" | "viewBox" | "children"
> & {
  size?: number;
};

const VB_W = 20;
const VB_H = 19;

export function StarIcon({
  size = 20,
  className,
  fill = "#EC942C",
  ...rest
}: StarIconProps) {
  const height = (size * VB_H) / VB_W;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={height}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      fill="none"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M9.51056 0L11.7557 6.90983H19.0211L13.1433 11.1803L15.3884 18.0902L9.51056 13.8197L3.63271 18.0902L5.87785 11.1803L-5.72205e-06 6.90983H7.26542L9.51056 0Z"
        fill={fill}
      />
    </svg>
  );
}

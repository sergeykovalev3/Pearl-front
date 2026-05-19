import type { ComponentPropsWithoutRef } from "react";

export type ClockIconProps = Omit<
  ComponentPropsWithoutRef<"svg">,
  "xmlns" | "viewBox" | "children"
> & {
  size?: number;
  fill?: string;
};

export function ClockIcon({
  size = 27,
  className,
  fill = "currentColor",
  ...rest
}: ClockIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 27 27"
      fill="none"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M13.25 26.5C20.5552 26.5 26.5 20.5552 26.5 13.25C26.5 5.94485 20.5552 0 13.25 0C5.94477 0 0 5.94485 0 13.25C0 20.5552 5.94485 26.5 13.25 26.5ZM13.25 1.76664C19.5835 1.76664 24.7334 6.91645 24.7334 13.25C24.7334 19.5835 19.5835 24.7334 13.25 24.7334C6.91645 24.7334 1.76664 19.5835 1.76664 13.25C1.76664 6.91645 6.91653 1.76664 13.25 1.76664Z"
        fill={fill}
      />
      <path
        d="M17.1141 17.4731C17.2776 17.6056 17.4718 17.6675 17.6662 17.6675C17.9268 17.6675 18.1829 17.5526 18.3552 17.3362C18.6599 16.9564 18.598 16.3999 18.2183 16.0951L14.1328 12.8268V6.1841C14.1328 5.69826 13.7354 5.30078 13.2495 5.30078C12.7637 5.30078 12.3662 5.69826 12.3662 6.1841V13.2508C12.3662 13.5202 12.4899 13.772 12.6975 13.9398L17.1141 17.4731Z"
        fill={fill}
      />
    </svg>
  );
}

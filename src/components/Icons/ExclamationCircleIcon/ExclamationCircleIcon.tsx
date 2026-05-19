import type { ComponentPropsWithoutRef } from "react";

export type ExclamationCircleIconProps = Omit<
  ComponentPropsWithoutRef<"svg">,
  "xmlns" | "viewBox" | "children"
> & {
  size?: number;
};

export function ExclamationCircleIcon({
  size = 18,
  className,
  ...rest
}: ExclamationCircleIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      {...rest}
    >
      <circle cx="12" cy="12" r="10" fill="#c62828" />
      <path
        d="M12 7v5.5M12 16h.01"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

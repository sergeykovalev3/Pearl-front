import type { ComponentPropsWithoutRef } from "react";

export type SearchIconProps = Omit<
  ComponentPropsWithoutRef<"svg">,
  "xmlns" | "viewBox" | "children"
> & {
  size?: number;
};

export function SearchIcon({
  size = 21,
  className,
  fill = "currentColor",
  ...rest
}: SearchIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 21 21"
      fill="none"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.739 1.5C5.196 1.5 1.5 5.195 1.5 9.738C1.5 14.281 5.196 17.977 9.739 17.977C14.281 17.977 17.977 14.281 17.977 9.738C17.977 5.195 14.281 1.5 9.739 1.5ZM9.739 19.477C4.369 19.477 0 15.108 0 9.738C0 4.368 4.369 0 9.739 0C15.109 0 19.477 4.368 19.477 9.738C19.477 15.108 15.109 19.477 9.739 19.477Z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.514 20.7218C19.323 20.7218 19.131 20.6488 18.984 20.5028L15.46 16.9888C15.167 16.6958 15.166 16.2208 15.459 15.9278C15.751 15.6328 16.226 15.6348 16.52 15.9258L20.044 19.4408C20.337 19.7338 20.338 20.2078 20.045 20.5008C19.899 20.6488 19.706 20.7218 19.514 20.7218Z"
        fill={fill}
      />
    </svg>
  );
}

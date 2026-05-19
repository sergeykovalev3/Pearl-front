import type { ComponentPropsWithoutRef } from "react";

export type ServiceArrowIconProps = Omit<
  ComponentPropsWithoutRef<"svg">,
  "xmlns" | "viewBox" | "children"
> & {
  iconSize?: number;
};

export function ServiceArrowIcon({
  className,
  iconSize = 20,
  ...rest
}: ServiceArrowIconProps) {
  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1.5C5.313 1.5 1.5 5.313 1.5 10C1.5 14.687 5.313 18.5 10 18.5C14.687 18.5 18.5 14.687 18.5 10C18.5 5.313 14.687 1.5 10 1.5ZM10 20C4.486 20 0 15.514 0 10C0 4.486 4.486 0 10 0C15.514 0 20 4.486 20 10C20 15.514 15.514 20 10 20Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.55858 14.221C8.36658 14.221 8.17358 14.148 8.02758 14C7.73558 13.706 7.73658 13.232 8.02958 12.94L10.9816 10L8.02958 7.06105C7.73658 6.76905 7.73558 6.29405 8.02758 6.00005C8.31958 5.70505 8.79358 5.70705 9.08758 5.99805L12.5736 9.46905C12.7146 9.61005 12.7936 9.80105 12.7936 10C12.7936 10.2 12.7146 10.391 12.5736 10.532L9.08758 14.002C8.94158 14.148 8.74958 14.221 8.55858 14.221Z"
        fill="currentColor"
      />
    </svg>
  );
}

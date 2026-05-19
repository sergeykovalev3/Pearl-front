import type { ImageProps } from "next/image";
import Image from "next/image";

import linkedInMark from "./LinkedInIcon.png";

export type LinkedInIconProps = Omit<ImageProps, "src" | "width" | "height"> & {
  /** Display width and height in CSS pixels. Default 24. */
  size?: number;
};

export function LinkedInIcon({
  size = 24,
  className,
  alt = "",
  ...rest
}: LinkedInIconProps) {
  return (
    <Image
      src={linkedInMark}
      alt={alt}
      width={size}
      height={size}
      className={className}
      {...rest}
    />
  );
}

export const SITE_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** All "Book Now" / "Book an appointment" CTAs navigate here (booking form lives in ContactIntro). */
export const SITE_CONTACT_BOOKING_HREF = "/contact" as const;

/** Profile URL used on specialist cards and similar outbound links. */
export const SITE_AUTHOR_GITHUB_HREF =
  "https://github.com/sergeykovalev3" as const;

export function siteNavLinkIsActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

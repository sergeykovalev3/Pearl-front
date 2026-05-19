import type { MouseEventHandler } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Article } from "@/data/articles";
import { SITE_AUTHOR_GITHUB_HREF } from "@/data/siteNavLinks";

import styles from "./BlogCard.module.scss";

function isInternalAppHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export type BlogCardProps = {
  article: Article;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  imageSizes?: string;
};

export function BlogCard({
  article,
  href = SITE_AUTHOR_GITHUB_HREF,
  onClick,
  imageSizes = "(max-width: 767px) min(100vw - 48px, 560px), (max-width: 991px) 45vw, 22vw",
}: BlogCardProps) {
  const { previewImage, tags, title, description, author } = article;

  const card = (
    <>
      <div className={styles.imageWrap}>
        <Image
          src={previewImage}
          alt=""
          fill
          className={styles.image}
          sizes={imageSizes}
        />
      </div>
      {tags.length > 0 ? (
        <ul className={styles.tags}>
          {tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <span className={styles.author}>~{author}</span>
      </div>
    </>
  );

  if (isInternalAppHref(href)) {
    return (
      <Link
        href={href}
        className={styles.root}
        aria-label={`${title} by ${author}`}
        onClick={onClick}
      >
        {card}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={styles.root}
      aria-label={`${title} by ${author}`}
      onClick={onClick}
    >
      {card}
    </a>
  );
}

import Image from "next/image";
import Link from "next/link";

import { ServiceArrowIcon } from "@/components/Icons/ServiceArrowIcon/ServiceArrowIcon";
import type { ServiceItem } from "@/data/services";

import styles from "./ServiceCard.module.scss";

export type ServiceCardProps = {
  service: ServiceItem;
  className?: string;
};

export function ServiceCard({ service, className }: ServiceCardProps) {
  const rootClass = [styles.root, className].filter(Boolean).join(" ");

  return (
    <article className={rootClass}>
      <div className={styles.body}>
        <div className={styles.imageWrap}>
          <Image src={service.image} alt="" width={59} height={59} />
        </div>
        <h3 className={styles.title}>{service.title}</h3>
        <p className={styles.description}>{service.description}</p>
      </div>
      <Link href={`/services/${service.id}`} className={styles.link}>
        <span className={styles.linkLabel}>Learn More</span>
        <ServiceArrowIcon />
      </Link>
    </article>
  );
}

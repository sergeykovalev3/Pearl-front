import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getServiceBySlug,
  services,
} from "@/data/services";
import { ServiceDetailPage } from "@/views/Services/ServiceDetailPage";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return services.map((service) => ({ slug: service.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return {
      title: "Service",
      description: "The requested service page could not be found.",
    };
  }
  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServiceDetailRoute({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  return <ServiceDetailPage service={service} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { blogPosts, getBlogPostBySlug } from "@/data/blog/posts";
import { BlogPostPage } from "@/views/Blogs/BlogPostPage";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return {
      title: "Article",
      description: "The requested article could not be found.",
    };
  }
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostRoute({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();
  return <BlogPostPage article={post} />;
}

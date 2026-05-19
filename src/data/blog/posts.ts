import type { Article } from "@/data/articles";
import { articles } from "@/data/articles";

export const blogPosts: Article[] = articles;

export function getBlogPostBySlug(slug: string): Article | undefined {
  return blogPosts.find((post) => post.id === slug);
}

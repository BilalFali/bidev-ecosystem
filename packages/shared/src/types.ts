export interface PostMeta {
  title: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  summary: string;
  image?: string;
  tags: string[];
  author?: string;
  readingTime?: number;
  draft?: boolean;
  category?: string;
  categorySlug?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export interface Tool {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: "utility" | "encoding" | "security" | "generator";
  popular?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

import { supabase, isSupabaseConfigured } from "../lib/supabase";

// Types
export interface Author {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  description_en?: string;
  description_ar?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title_en: string;
  title_ar: string;
  slug: string;
  excerpt_en?: string;
  excerpt_ar?: string;
  content_en: string;
  content_ar: string;
  featured_image?: string;
  cover_image?: string;
  language: string;
  category_id: string;
  author_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  author?: Author;
  tags?: Tag[];
}

// Helper function to handle Supabase errors
const handleError = (error: { message?: string }) => {
  console.error("Supabase error:", error);
  throw new Error(error.message || "An error occurred");
};

// Blog API
export const blogService = {
  // Get all published posts with pagination
  async getPosts(
    page = 1,
    perPage = 10,
    categorySlug?: string,
    tagSlug?: string,
  ) {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: [], count: 0 };
    }

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    try {
      // First try with full relations
      let query = supabase
        .from("posts")
        .select(
          `
          *,
          category:categories(*),
          author:authors(*)
        `,
          { count: "exact" },
        )
        .eq("published", true)
        .order("created_at", { ascending: false })
        .range(from, to);

      const { data, error, count } = await query;

      // If there's an error (possibly due to missing relations), try simple query
      if (error) {
        console.warn("Full query failed, trying simple query:", error.message);
        const simpleQuery = supabase
          .from("posts")
          .select("*", { count: "exact" })
          .eq("published", true)
          .order("created_at", { ascending: false })
          .range(from, to);

        const {
          data: simpleData,
          error: simpleError,
          count: simpleCount,
        } = await simpleQuery;

        if (simpleError) {
          console.error("Simple query also failed:", simpleError.message);
          return { data: [], count: 0 };
        }

        return {
          data: simpleData || [],
          count: simpleCount || 0,
          total_pages: Math.ceil((simpleCount || 0) / perPage),
          current_page: page,
          per_page: perPage,
        };
      }

      return {
        data: data || [],
        count: count || 0,
        total_pages: Math.ceil((count || 0) / perPage),
        current_page: page,
        per_page: perPage,
      };
    } catch (err) {
      console.error("Unexpected error in getPosts:", err);
      return { data: [], count: 0 };
    }
  },

  // Get a single post by slug
  async getPostBySlug(slug: string): Promise<Post | null> {
    if (!supabase) return null;

    try {
      // Try with relations first
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          category:categories(*),
          author:authors(*)
        `,
        )
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) {
        // Try simple query
        const { data: simpleData, error: simpleError } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .eq("published", true)
          .single();

        if (simpleError) {
          if (simpleError.code === "PGRST116") return null;
          console.error("Error fetching post:", simpleError.message);
          return null;
        }
        return simpleData;
      }

      return data;
    } catch (err) {
      console.error("Unexpected error in getPostBySlug:", err);
      return null;
    }
  },

  // Get recent posts
  async getRecentPosts(limit = 5) {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching recent posts:", error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error("Unexpected error in getRecentPosts:", err);
      return [];
    }
  },

  // Get featured posts
  async getFeaturedPosts(limit = 3) {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching featured posts:", error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error("Unexpected error in getFeaturedPosts:", err);
      return [];
    }
  },

  // Get all categories
  async getCategories() {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name_en", { ascending: true });

      if (error) {
        console.error("Error fetching categories:", error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error("Unexpected error in getCategories:", err);
      return [];
    }
  },

  // Get all tags
  async getTags() {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name_en", { ascending: true });

      if (error) {
        console.error("Error fetching tags:", error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error("Unexpected error in getTags:", err);
      return [];
    }
  },
};

import { storyblokInit, apiPlugin, StoryblokClient } from "@storyblok/react";

// Debug: Log the token (first 10 chars only for security)
const token = import.meta.env.VITE_STORYBLOK_TOKEN || "";
console.log('[Storyblok Init] Token available:', token ? `${token.substring(0, 10)}...` : 'NO TOKEN FOUND');

// Initialize Storyblok
const initResult = storyblokInit({
  accessToken: token,
  use: [apiPlugin],
  apiOptions: {
    region: "eu",
  },
});

console.log('[Storyblok Init] Init result:', initResult);

// Create API client directly as fallback
let storyblokApi = initResult?.storyblokApi;

// If storyblokApi is not available from init, create it directly
if (!storyblokApi && token) {
  console.log('[Storyblok Init] Creating API client directly...');
  storyblokApi = new StoryblokClient({
    accessToken: token,
    region: "eu",
  });
  console.log('[Storyblok Init] Direct API client created:', !!storyblokApi);
}

export { storyblokApi };

// Type definitions
export interface StoryblokStory<T = any> {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  full_slug: string;
  created_at: string;
  published_at: string;
  content: T;
}

export interface SEO {
  component: "seo";
  title: string;
  description?: string;
  image?: { filename: string; alt?: string };
  keywords?: string;
}

// Helper to fetch a single story
export async function getStory<T = any>(
  slug: string,
  params?: any
): Promise<StoryblokStory<T> | null> {
  if (!storyblokApi) {
    console.error(
      'Storyblok API not initialized. Check if VITE_STORYBLOK_TOKEN is set.'
    );
    return null;
  }

  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: import.meta.env.DEV ? "draft" : "published",
      cv: Date.now(), // Cache buster - forces fresh content
      ...params,
    });
    return data.story;
  } catch (error) {
    console.error(`Error fetching story ${slug}:`, error);
    return null;
  }
}

// Helper to fetch multiple stories
export async function getStories<T = any>(
  params?: any
): Promise<StoryblokStory<T>[]> {
  if (!storyblokApi) {
    console.error('Storyblok API not initialized. Check if VITE_STORYBLOK_TOKEN is set.');
    return [];
  }
  
  try {
    const { data } = await storyblokApi.get("cdn/stories", {
      version: import.meta.env.DEV ? "draft" : "published",
      cv: Date.now(), // Cache buster - forces fresh content
      ...params,
    });
    return data.stories;
  } catch (error) {
    console.error("Error fetching stories:", error);
    return [];
  }
}

// Helper to get image URL from Storyblok asset
export function getImageUrl(
  image: { filename: string } | string | undefined,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "png" | "jpg";
  }
): string {
  if (!image) return "";
  
  const filename = typeof image === "string" ? image : image.filename;
  if (!filename) return "";

  // Storyblok Image Service
  const params = new URLSearchParams();
  if (options?.width) params.append("m", `${options.width}x0`);
  if (options?.quality) params.append("quality", options.quality.toString());
  if (options?.format) params.append("format", options.format);

  return params.toString() ? `${filename}/m/${params.toString()}` : filename;
}

// Get global settings
export async function getGlobalSettings() {
  return getStory("global-settings");
}
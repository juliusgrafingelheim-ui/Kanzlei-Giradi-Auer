import StoryblokClient from "storyblok-js-client";

// Get the token
const token = import.meta.env.VITE_STORYBLOK_TOKEN || "";

// Determine content version:
// - "draft" requires a preview/private token
// - "published" works with public tokens
// - Use "draft" only in dev mode OR when inside Storyblok Visual Editor
const isStoryblokEditor =
  typeof window !== "undefined" &&
  window.location.search.includes("_storyblok");
const contentVersion: "draft" | "published" =
  import.meta.env.DEV || isStoryblokEditor ? "draft" : "published";

// Create API client directly
const storyblokApi = token
  ? new StoryblokClient({
      accessToken: token,
      region: "eu",
      cache: {
        clear: "auto",
        type: "memory",
      },
    })
  : null;

if (!token) {
  console.info("[Storyblok] No token found. Using fallback data.");
} else {
  console.info(`[Storyblok] Initialized (version: ${contentVersion})`);
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
    console.warn(
      "[Storyblok] API not initialized. Check VITE_STORYBLOK_TOKEN."
    );
    return null;
  }

  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: contentVersion,
      cv: Date.now(), // Cache buster
      ...params,
    });

    return data.story;
  } catch (error: any) {
    // Only log real errors, not 404s (story not created yet)
    if (error?.status === 404) {
      console.info(`[Storyblok] Story "${slug}" not found – using fallback.`);
    } else {
      console.error(`[Storyblok] Error fetching "${slug}":`, error?.message || error);
    }
    return null;
  }
}

// Helper to fetch multiple stories
export async function getStories<T = any>(
  params?: any
): Promise<StoryblokStory<T>[]> {
  if (!storyblokApi) {
    console.warn("[Storyblok] API not initialized.");
    return [];
  }

  try {
    const { data } = await storyblokApi.get("cdn/stories", {
      version: contentVersion,
      cv: Date.now(),
      ...params,
    });
    return data.stories;
  } catch (error: any) {
    console.error("[Storyblok] Error fetching stories:", error?.message || error);
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
import StoryblokClient from "storyblok-js-client";

// Get the token
const token = import.meta.env.VITE_STORYBLOK_TOKEN || "";

// Detect if we're inside the Storyblok Visual Editor
export const isStoryblokEditor =
  typeof window !== "undefined" &&
  window.location.search.includes("_storyblok");

// Determine content version:
// - "draft" requires a preview/private token
// - "published" works with public tokens
// - Use "draft" in dev mode OR when inside Storyblok Visual Editor
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

// ─── Storyblok Bridge for Visual Editor ──────────────────────────────────────
// The bridge sends real-time "input" events when editors change content,
// and "published" / "change" events when they publish or switch languages.

type BridgeCallback = (payload: any) => void;
const listeners = new Map<string, Set<BridgeCallback>>();

/** Subscribe to real-time content updates for a specific story slug */
export function onStoryblokInput(slug: string, cb: BridgeCallback) {
  if (!listeners.has(slug)) listeners.set(slug, new Set());
  listeners.get(slug)!.add(cb);
  return () => {
    listeners.get(slug)?.delete(cb);
  };
}

/** Notify all listeners that content for a story was updated */
function notifyListeners(fullSlug: string, content: any) {
  // Try exact match first, then partial matches
  for (const [slug, cbs] of listeners) {
    if (fullSlug === slug || fullSlug.endsWith(slug) || slug.endsWith(fullSlug)) {
      cbs.forEach((cb) => cb(content));
    }
  }
}

let bridgeLoaded = false;

/** Load and initialize the Storyblok Bridge script for real-time editing */
export function initStoryblokBridge() {
  if (bridgeLoaded || !isStoryblokEditor || typeof window === "undefined") return;
  bridgeLoaded = true;

  console.info("[Storyblok] Visual Editor detected – loading Bridge...");

  const script = document.createElement("script");
  script.src = "https://app.storyblok.com/f/storyblok-v2-latest.js";
  script.async = true;
  script.onload = () => {
    console.info("[Storyblok] Bridge script loaded.");

    const { StoryblokBridge } = window as any;
    if (!StoryblokBridge) {
      console.warn("[Storyblok] StoryblokBridge not found on window.");
      return;
    }

    const bridge = new StoryblokBridge({
      accessToken: token,
      resolveRelations: [],
      preventClicks: true,
    });

    // Real-time input event – fires on every keystroke / field change
    bridge.on("input", (event: any) => {
      if (event?.story?.content) {
        const fullSlug = event.story.full_slug || event.story.slug || "";
        console.info(`[Storyblok Bridge] input event for "${fullSlug}"`);
        notifyListeners(fullSlug, event.story.content);
      }
    });

    // Published event – content was saved & published
    bridge.on("published", () => {
      console.info("[Storyblok Bridge] Content published – reloading...");
      window.location.reload();
    });

    // Change event – user switched to another story in the editor
    bridge.on("change", () => {
      console.info("[Storyblok Bridge] Story changed – reloading...");
      window.location.reload();
    });

    // Enter edit mode event
    bridge.on("enterEditmode", (event: any) => {
      console.info("[Storyblok Bridge] Enter edit mode for story:", event?.storyId);
    });
  };

  script.onerror = () => {
    console.warn("[Storyblok] Failed to load Bridge script.");
  };

  document.head.appendChild(script);
}

// ─── Type definitions ────────────────────────────────────────────────────────

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

// ─── API Helpers ─────────────────────────────────────────────────────────────

/** Fetch a single story */
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

/** Fetch multiple stories */
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

/** Get image URL from Storyblok asset (with optional transforms) */
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

/** Get global settings */
export async function getGlobalSettings() {
  return getStory("global-settings");
}

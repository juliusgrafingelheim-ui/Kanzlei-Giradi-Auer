import StoryblokClient from "storyblok-js-client";

// Get the token
const token = import.meta.env.VITE_STORYBLOK_TOKEN || "";

// Detect if we're inside the Storyblok Visual Editor
export const isStoryblokEditor =
  typeof window !== "undefined" &&
  window.location.search.includes("_storyblok");

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
  console.info(
    `[Storyblok] Initialized (editor: ${isStoryblokEditor ? "yes" : "no"})`
  );
}

export { storyblokApi };

// ─── Storyblok Bridge for Visual Editor ──────────────────────────────────────

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
  for (const [slug, cbs] of listeners) {
    if (
      fullSlug === slug ||
      fullSlug.endsWith(slug) ||
      slug.endsWith(fullSlug)
    ) {
      cbs.forEach((cb) => cb(content));
    }
  }
}

let bridgeLoaded = false;

/** Load and initialize the Storyblok Bridge script for real-time editing */
export function initStoryblokBridge() {
  if (bridgeLoaded || !isStoryblokEditor || typeof window === "undefined")
    return;
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

    bridge.on("enterEditmode", (event: any) => {
      console.info(
        "[Storyblok Bridge] Enter edit mode for story:",
        event?.storyId
      );
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

/**
 * Fetch a single story.
 *
 * Strategy:
 * - In the Visual Editor → try "draft" first (needs a preview token).
 *   If that fails (e.g. public token → 401), retry with "published"
 *   so the editor at least shows the current live content.
 * - Outside the editor → always use "published".
 *
 * The Bridge handles real-time draft previews via input events,
 * so even with a public token, editors see their changes live.
 */
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

  const baseParams = { cv: Date.now(), ...params };

  // Always try "draft" first (needs preview token) so unpublished
  // assets (images) are visible immediately after upload.
  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: "draft",
      ...baseParams,
    });
    if (data?.story) {
      console.info(`[Storyblok] Fetched "${slug}" (draft)`);
      return data.story;
    }
  } catch (draftError: any) {
    // Draft failed (likely 401 with public token) – fall through to published
    console.info(
      `[Storyblok] Draft fetch failed for "${slug}" (${draftError?.status || "unknown"}) – trying published...`
    );
  }

  // Fallback: fetch published version
  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: "published",
      ...baseParams,
    });
    if (data?.story) {
      console.info(`[Storyblok] Fetched "${slug}" (published)`);
      return data.story;
    }
    return null;
  } catch (error: any) {
    if (error?.status === 404) {
      console.info(`[Storyblok] Story "${slug}" not found – using fallback.`);
    } else {
      console.error(
        `[Storyblok] Error fetching "${slug}":`,
        error?.message || error
      );
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
      version: "published",
      cv: Date.now(),
      ...params,
    });
    return data.stories;
  } catch (error: any) {
    console.error(
      "[Storyblok] Error fetching stories:",
      error?.message || error
    );
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
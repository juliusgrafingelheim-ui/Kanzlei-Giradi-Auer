/**
 * Storyblok CMS Initialization
 *
 * This file initializes the Storyblok SDK for the Girardi & Auer website.
 * The access token should be set as an environment variable:
 *   VITE_STORYBLOK_TOKEN=your_public_token
 *
 * In Vercel, add this as an environment variable.
 *
 * Content Types to create in Storyblok:
 *
 * 1. "home" (Content Type) — Homepage content
 *    - hero_title (text)
 *    - hero_subtitle (text)
 *    - hero_cta_text (text)
 *    - hero_cta_link (text)
 *    - hero_image (asset)
 *    - stat_1_number (text), stat_1_label (text)
 *    - stat_2_number (text), stat_2_label (text)
 *    - stat_3_number (text), stat_3_label (text)
 *    - expertise_title (text), expertise_subtitle (text)
 *    - feature_{1-4}_title (text), feature_{1-4}_desc (text), feature_{1-4}_icon (text)
 *    - team_section_title (text), team_section_subtitle (text)
 *    - team_image_1 (asset), team_image_2 (asset)
 *    - why_title (text)
 *    - why_{1-3}_title (text), why_{1-3}_desc (text), why_{1-3}_icon (text)
 *    - location_badge (text), location_title (text), location_subtitle (text)
 *    - location_cta_text (text), location_cta_link (text)
 *    - seo_title (text), seo_description (text), seo_keywords (text)
 *
 * 2. "practice-areas" (Content Type) — Practice areas page
 *    - hero_badge (text), hero_title (text), hero_subtitle (text)
 *    - area_{1-9}_title (text), area_{1-9}_desc (text), area_{1-9}_icon (text)
 *    - info_title (text), info_para_1 (text), info_para_2 (text)
 *    - partner_title (text), partner_subtitle (text)
 *    - bookshelf_image (asset)
 *    - seo_title (text), seo_description (text), seo_keywords (text)
 *
 * Story slugs: home, practice-areas
 */

import { storyblokInit, apiPlugin } from "@storyblok/react";

// Access token from environment variable
const STORYBLOK_TOKEN = import.meta.env.VITE_STORYBLOK_TOKEN || "";

// Detect if we're in Storyblok Visual Editor (preview mode)
const isPreview =
  typeof window !== "undefined" &&
  window.location.search.includes("_storyblok");

/**
 * Initialize Storyblok SDK.
 * Call this once at app startup (in App.tsx).
 */
export function initStoryblok() {
  if (!STORYBLOK_TOKEN) {
    console.info(
      "[Storyblok] No token found (VITE_STORYBLOK_TOKEN). Using fallback data."
    );
    return;
  }

  storyblokInit({
    accessToken: STORYBLOK_TOKEN,
    use: [apiPlugin],
    bridge: isPreview, // Enable bridge only in Visual Editor
    apiOptions: {
      region: "eu", // Change to "us" if your space is in the US region
    },
  });

  console.info("[Storyblok] Initialized", isPreview ? "(preview)" : "(published)");
}

/**
 * Whether Storyblok is configured (token is present).
 */
export function isStoryblokConfigured(): boolean {
  return !!STORYBLOK_TOKEN;
}

/**
 * Get the content version based on environment.
 * With a Preview token, "draft" works in the editor and dev.
 * With a Public token, only "published" works — but the Bridge
 * still handles real-time draft updates in the Visual Editor.
 */
export function getContentVersion(): "draft" | "published" {
  if (isPreview) return "draft";
  if (import.meta.env.DEV) return "draft";
  return "published";
}

export { STORYBLOK_TOKEN };
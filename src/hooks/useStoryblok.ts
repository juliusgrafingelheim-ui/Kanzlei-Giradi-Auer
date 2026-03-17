import { useEffect, useState, useCallback } from "react";
import { getStory, onStoryblokInput, isStoryblokEditor, StoryblokStory } from "../lib/storyblok";

/**
 * Hook to fetch and use Storyblok content.
 * - Fetches content from the Storyblok CDN API on mount.
 * - Falls back to null if Storyblok is not configured or the story doesn't exist.
 * - When inside the Storyblok Visual Editor, subscribes to real-time "input"
 *   events via the Bridge so content updates appear instantly (no page reload).
 */
export function useStoryblok<T = any>(
  slug: string
): { content: T | null; loading: boolean; error: Error | null } {
  const [content, setContent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initial fetch from CDN API
  useEffect(() => {
    const hasToken = import.meta.env.VITE_STORYBLOK_TOKEN;

    if (!hasToken) {
      // No token – skip fetch, use fallback immediately
      setContent(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const story = await getStory<T>(slug);

        if (cancelled) return;

        if (story?.content) {
          setContent(story.content);
        } else {
          setContent(null);
        }
      } catch (err) {
        if (cancelled) return;
        console.error(`[useStoryblok] Error for "${slug}":`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setContent(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Subscribe to real-time Bridge events when inside the Visual Editor
  useEffect(() => {
    if (!isStoryblokEditor) return;

    const unsubscribe = onStoryblokInput(slug, (updatedContent: T) => {
      console.info(`[useStoryblok] Live update received for "${slug}"`);
      setContent(updatedContent);
      setLoading(false);
    });

    return unsubscribe;
  }, [slug]);

  return { content, loading, error };
}

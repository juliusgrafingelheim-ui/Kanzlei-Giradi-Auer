import { useEffect, useState } from "react";
import { getStory, StoryblokStory } from "../lib/storyblok";

/**
 * Hook to fetch and use Storyblok content.
 * Falls back to null if Storyblok is not configured or the story doesn't exist,
 * so pages can use their own fallback data.
 */
export function useStoryblok<T = any>(
  slug: string
): { content: T | null; loading: boolean; error: Error | null } {
  const [content, setContent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

  return { content, loading, error };
}
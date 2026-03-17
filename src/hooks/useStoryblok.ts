import { useEffect, useState } from "react";
import { getStory, StoryblokStory } from "../lib/storyblok";

/**
 * Hook to fetch and use Storyblok content
 * Falls back to provided fallback data if Storyblok is not configured or fails
 */
export function useStoryblok<T = any>(
  slug: string
): { content: T | null; loading: boolean; error: Error | null } {
  const [content, setContent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if Storyblok token is configured
    const hasToken = import.meta.env.VITE_STORYBLOK_TOKEN;
    
    if (!hasToken) {
      // No token configured - use fallback
      console.log(`No Storyblok token configured for ${slug}`);
      setContent(null);
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        const story = await getStory<T>(slug);
        
        if (story && story.content) {
          setContent(story.content);
        } else {
          console.warn(`Story not found for ${slug}`);
          setContent(null);
        }
      } catch (err) {
        console.error(`Error fetching story ${slug}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setContent(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  return { content, loading, error };
}
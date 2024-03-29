import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";

/**
 *
 * @param {import("@supabase/supabase-js").User} user
 */
export const useBookmark = (user) => {
  const supabase = useSupabaseClient();
  const { data: bookmarks, ...rest } = useSWR(
    user ? `bookmark-${user.id}` : null,
    async () => {
      const { data, error } = await supabase
        .from("profile_bookmark")
        .select("post_id")
        .eq("profile_id", user.id);
      if (error) throw new Error(error.message);
      return data?.map((d) => d.post_id);
    }
  );
  return {
    bookmarks,
    ...rest,
  };
};

export const useBookmarkCount = (postId) => {
  const supabase = useSupabaseClient();
  const { data: bookmarkCount, ...rest } = useSWR(
    postId ? `bookmark-count-${postId}` : null,
    async () => {
      const { data, count, error } = await supabase
        .from("profile_bookmark")
        .select("post_id", { count: "exact" })
        .eq("post_id", postId);
      if (error) throw new Error(error.message);
      return count;
    }
  );
  return {
    bookmarkCount,
    ...rest,
  };
};

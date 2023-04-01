import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";

/**
 *
 * @param {import("@supabase/supabase-js").User} user
 */
export const useLike = (user) => {
  const supabase = useSupabaseClient();
  const { data: likes, ...rest } = useSWR(
    user ? `like-${user.id}` : null,
    async () => {
      const { data, error } = await supabase
        .from("like_post")
        .select("post_id")
        .eq("profile_id", user.id);
      if (error) throw new Error(error.message);
      return data?.map((d) => d.post_id);
    }
  );
  return {
    likes,
    ...rest,
  };
};

export const useLikeCount = (postId) => {
  const supabase = useSupabaseClient();
  const { data: likeCount, ...rest } = useSWR(
    postId ? `like-count-${postId}` : null,
    async () => {
      const { data, count, error } = await supabase
        .from("like_post")
        .select("post_id", { count: "exact" })
        .eq("post_id", postId);
      if (error) throw new Error(error.message);
      return count;
    }
  );
  return {
    likeCount,
    ...rest,
  };
};

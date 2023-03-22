import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";
import { getPagination } from "../getPagination";

export const usePostPagination = (page) => {
  const supabase = useSupabaseClient();
  const { data, ...rest } = useSWR(`post-page-${page}`, async () => {
    const { from, to } = getPagination(page, 10);
    const {
      data: post,
      count,
      error,
    } = await supabase
      .from("post")
      .select(
        "*, post_tag(tag(name)), profile!post_profile_id_fkey(username, avatar_url, email, name)",
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);
    if (error) {
      throw new Error(error);
    }
    return {
      data: post,
      count: count,
      page: +page,
    };
  });
  return {
    data,
    ...rest,
  };
};

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { getPagination } from "../getPagination";

export const usePostPagination = (page, type = "blog") => {
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
      .eq("type", type)
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

export const useArticleInfiniteLoading = (type = "blog") => {
  const supabase = useSupabaseClient();
  const { data, ...rest } = useSWRInfinite(
    (index) => [`post-${type}-page-${index}`, index],
    async ([key, index]) => {
      const { from, to } = getPagination(index);
      const { data, error } = await supabase
        .from("post")
        .select(
          "*, post_tag!inner(tag_id, tag!inner(name)), profile!post_profile_id_fkey(username, avatar_url, email, name)"
        )
        .eq("type", type)
        .in("post_tag.tag_id", ["1"])
        .order("created_at", { ascending: false })
        .range(from, to - 1);
      if (error) {
        throw new Error(error);
      }
      return {
        data,
      };
    }
  );
  return {
    data: data ? data.map((d) => d.data) : [],
    ...rest,
  };
};

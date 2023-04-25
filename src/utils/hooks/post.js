import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { getPagination } from "../getPagination";

// export const usePostPagination = (page, type = "blog") => {
//   const supabase = useSupabaseClient();
//   const { data, ...rest } = useSWR(`post-page-${page}`, async () => {
//     const { from, to } = getPagination(page, 10);
//     const {
//       data: post,
//       count,
//       error,
//     } = await supabase
//       .from("post")
//       .select(
//         "*, post_tag(tag(name)), profile!post_profile_id_fkey(username, avatar_url, email, name)",
//         { count: "exact" }
//       )
//       .eq("type", type)
//       .order("created_at", { ascending: false })
//       .range(from, to);
//     if (error) {
//       throw new Error(error);
//     }
//     return {
//       data: post,
//       count: count,
//       page: +page,
//     };
//   });
//   return {
//     data,
//     ...rest,
//   };
// };

export const useArticleInfiniteLoading = (type, searchString, tag) => {
  const supabase = useSupabaseClient();
  const tagString = tag?.join(".");
  const { data, ...rest } = useSWRInfinite(
    (index) => [
      `post-${type}-page-${index}&q=${searchString}&t=${tagString}`,
      index,
    ],
    async ([key, index]) => {
      // const { from, to } = getPagination(index);
      let query = supabase
        .from("post")
        .select(
          "*, post_tag!inner(tag_id, tag!inner(name)), profile!post_profile_id_fkey(username, avatar_url, email, name)"
        )
        .eq("type", type);
      if (searchString) {
        query = query.textSearch("title", searchString, { type: "plain" });
      }
      if (tag.length !== 0) {
        query = query.in("post_tag.tag_id", tag);
      }
      const { data, error } = await query
        .order("created_at", { ascending: false })
        .order("updated_at", { ascending: false })
        .order("id")
        .range(
          index == 0 ? 0 : index * 10,
          index == 0 ? 9 : index * 10 + 10 - 1
        );
      if (error) {
        throw new Error(error);
      }
      return {
        data,
      };
    },
    {}
  );
  return {
    data: data ? data.map((d) => d.data) : [],
    ...rest,
  };
};

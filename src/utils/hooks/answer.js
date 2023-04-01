import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";

export const useAnswerCount = (postId) => {
  const supabase = useSupabaseClient();
  const { data: answerCount, ...rest } = useSWR(
    postId ? `answer-count-${postId}` : null,
    async () => {
      const { data, count, error } = await supabase
        .from("answer")
        .select("post_id", { count: "exact" })
        .eq("post_id", postId);
      if (error) throw new Error(error.message);
      return count;
    }
  );
  return {
    answerCount,
    ...rest,
  };
};

export const useAnswers = (postId) => {
  const supabase = useSupabaseClient();
  const { data: answers, ...rest } = useSWR(
    postId ? `answers-${postId}` : null,
    async () => {
      const { data, error } = await supabase
        .from("answer")
        .select("*, profile(name, username, avatar_url)")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      if (data) return data;
    }
  );
  return {
    answers,
    ...rest,
  };
};

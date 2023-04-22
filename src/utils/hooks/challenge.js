import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";

export const useChallengeResult = (user) => {
  const supabase = useSupabaseClient();
  const { data, ...rest } = useSWR(
    user ? `challenge-result-${user}` : null,
    async () => {
      const { data } = await supabase
        .from("practice_challenge_record")
        .select("practice_challenge_id, score")
        .eq("profile_id", user?.id)
        .throwOnError();
      console.log(data);
      return data;
    }
  );
  return {
    data,
    ...rest,
  };
};

// export const useAnswers = (postId) => {
//   const supabase = useSupabaseClient();
//   const { data: answers, ...rest } = useSWR(
//     postId ? `answers-${postId}` : null,
//     async () => {
//       const { data, error } = await supabase
//         .from("answer")
//         .select("*, profile(name, username, avatar_url)")
//         .eq("post_id", postId)
//         .order("created_at", { ascending: false });
//       if (error) {
//         console.log(error);
//         throw new Error(error.message);
//       }
//       if (data) return data;
//     }
//   );
//   return {
//     answers,
//     ...rest,
//   };
// };

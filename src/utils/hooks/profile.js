import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";

/**
 *
 * @param {("id" | "username")} key
 * @param {string} value
 */
export const useProfile = (key, value) => {
  const supabase = useSupabaseClient();
  const { data: profile, ...rest } = useSWR(
    () => value && [`profile-by-${key}`, value],
    async () => {
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .eq(key, value)
        .single();
      if (error) throw new Error(error.message);
      return data;
    }
  );
  return {
    profile,
    ...rest,
  };
};
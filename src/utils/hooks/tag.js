import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";

export const useTag = async () => {
  const supabase = useSupabaseClient();
  const {} = useSWR;
};

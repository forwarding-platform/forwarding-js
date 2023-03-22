import { useBookmark } from "@/utils/hooks/bookmark";
import { ActionIcon, useMantineTheme } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { IconBookmark } from "@tabler/icons-react";

export default function BookmarkIcon({ postId, bookmarks, mutate }) {
  const user = useUser();
  const theme = useMantineTheme();
  const supabase = useSupabaseClient();
  const bookmarked = bookmarks?.includes(postId);
  if (bookmarks) {
    const handleBookmark = async () => {
      if (!user)
        return modals.openContextModal({
          modal: "requireAuth",
          title: "Authentication Required",
        });
      else {
        if (bookmarked) {
          const { data } = await supabase
            .from("profile_bookmark")
            .delete({ count: 1 })
            .eq("profile_id", user.id)
            .eq("post_id", postId)
            .select("post_id")
            .single();
          if (data) {
            mutate([...bookmarks.filter((b) => b !== data.post_id)]);
          }
        } else {
          const { data } = await supabase
            .from("profile_bookmark")
            .insert({
              profile_id: user.id,
              post_id: postId,
            })
            .select("post_id")
            .single();
          if (data) mutate([...bookmarks, data.post_id]);
        }
      }
    };

    return (
      <ActionIcon onClick={handleBookmark} variant="subtle" radius="xl">
        <IconBookmark
          strokeWidth={1.5}
          fill={bookmarked ? theme.fn.primaryColor() : "transparent"}
          color={theme.fn.primaryColor()}
        />
      </ActionIcon>
    );
  } else
    return (
      <ActionIcon variant="subtle" radius="xl">
        <IconBookmark strokeWidth={1.5} color={theme.fn.primaryColor()} />
      </ActionIcon>
    );
}

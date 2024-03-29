import { useBookmark, useBookmarkCount } from "@/utils/hooks/bookmark";
import {
  ActionIcon,
  Group,
  Text,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { IconBookmark } from "@tabler/icons-react";

export default function BookmarkIcon({ postId, bookmarks, mutate }) {
  const user = useUser();
  const theme = useMantineTheme();
  const supabase = useSupabaseClient();
  const bookmarked = bookmarks?.includes(postId);
  const { bookmarkCount, mutate: countMutate } = useBookmarkCount(postId);
  const handleBookmark = async () => {
    if (!user) {
      console.log("no");
      return modals.openContextModal({
        modal: "requireAuth",
        title: "Authentication Required",
      });
    } else {
      if (bookmarks) {
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
            countMutate(bookmarkCount - 1);
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
          if (data) {
            mutate([...bookmarks, data.post_id]);
            countMutate(bookmarkCount + 1);
          }
        }
      }
    }
  };

  return (
    <Tooltip label="Bookmark">
      <UnstyledButton component={Group} spacing={5} onClick={handleBookmark}>
        <Text>{bookmarkCount ?? 0}</Text>
        <IconBookmark
          strokeWidth={1.5}
          fill={bookmarked ? theme.fn.primaryColor() : "transparent"}
          color={theme.fn.primaryColor()}
        />
      </UnstyledButton>
    </Tooltip>
  );
}

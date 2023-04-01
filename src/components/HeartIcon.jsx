import { useLikeCount } from "@/utils/hooks/like";
import {
  Group,
  Text,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { IconHeart } from "@tabler/icons-react";
import React from "react";

export default function HeartIcon({ postId, likes, mutate }) {
  const user = useUser();
  const theme = useMantineTheme();
  const supabase = useSupabaseClient();
  const { likeCount, mutate: likeCountMutate } = useLikeCount(postId);
  const liked = likes?.includes(postId);
  const handleLike = async () => {
    if (!user) {
      return modals.openContextModal({
        modal: "requireAuth",
        title: "Authentication Required",
      });
    } else {
      if (likes) {
        if (liked) {
          const { data } = await supabase
            .from("like_post")
            .delete({ count: 1 })
            .eq("profile_id", user.id)
            .eq("post_id", postId)
            .select("post_id")
            .single();
          if (data) {
            mutate([...likes.filter((b) => b !== data.post_id)]);
            likeCountMutate(likeCount - 1);
          }
        } else {
          const { data } = await supabase
            .from("like_post")
            .insert({
              profile_id: user.id,
              post_id: postId,
            })
            .select("post_id")
            .single();
          if (data) {
            mutate([...likes, data.post_id]);
            likeCountMutate(likeCount + 1);
          }
        }
      }
    }
  };
  return (
    <Tooltip label="Like">
      <UnstyledButton component={Group} spacing={5} onClick={handleLike}>
        <Text>{likeCount ?? 0}</Text>
        <IconHeart
          color={theme.fn.primaryColor()}
          strokeWidth={1.5}
          fill={liked ? theme.fn.primaryColor() : "transparent"}
        />
      </UnstyledButton>
    </Tooltip>
  );
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { supabaseAdmin } from "@/libs/adminSupabase";
import postTag from "@/utils/seeds/postTag.json";

export default async function handler(req, res) {
  const flattenPostTag = postTag
    .map((item) => {
      const postId = item.postId;
      const tagIds = [...new Set(item.tagId)];
      const result = [];
      tagIds.forEach((tagId) => {
        result.push({
          post_id: postId,
          tag_id: tagId,
        });
      });
      return result;
    })
    .flat();
  const { error } = await supabaseAdmin.from("post_tag").insert(flattenPostTag);
  if (error) res.status(400).send(error.message);
  else res.send("OK");
}

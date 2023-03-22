// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { supabaseAdmin } from "@/libs/adminSupabase";
import posts from "@/utils/seeds/post.json";

export default async function handler(req, res) {
  const dt = posts.map((post) => ({
    title: post.title,
    content: `# ${post.heading1} \n${post.content1}\n# ${post.heading2} \n![](${post.image}) \n${post.content2}`,
    profile_id: post.authorId,
    type: "blog",
  }));
  const { error } = await supabaseAdmin.from("post").insert(dt);
  if (error) res.status(400).send(error.message);
  else res.send("OK");
}

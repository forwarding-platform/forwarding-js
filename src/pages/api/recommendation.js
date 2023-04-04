import { supabaseAdmin } from "@/libs/adminSupabase";
const recommend = require("collaborative-filter");
/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
  // if (req.method != "POST") {
  //   res.status(405).send({ message: "Only accept POST method." });
  // }
  // const body = JSON.parse(req.body);
  const { data, error } = await supabaseAdmin.from("like_post").select("*");
  if (error) {
    console.log(error.message, error);
    res.status(500).send({ message: "500" });
  }
  const users = [...new Set(data.map((row) => row.profile_id))];
  const posts = [...new Set(data.map((row) => row.post_id))];
  const matrix = Array.from({ length: users.length }, () =>
    Array.from({ length: posts.length }, () => 0)
  );
  data.forEach((d) => {
    const userIndex = users.indexOf(d.profile_id);
    const postIndex = posts.indexOf(d.post_id);
    matrix[userIndex][postIndex] = 1; // set 1 as the rating for a like
  });
  const co = recommend.coMatrix(matrix);
  const rec = recommend.getRecommendations(matrix, co, 1);
  res.send(rec);
}

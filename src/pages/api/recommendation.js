import { cache } from "@/libs/lru-cache";
import {
  SupabaseClient,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
const recommend = require("collaborative-filter");

/**
 *
 * @param {SupabaseClient} supabase
 */
async function prepareData(supabase) {
  const cacheKey = "like-post-matrix";
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log("already have");
    return cachedData;
  }
  const { data, error } = await supabase.from("like_post").select("*");
  if (error) throw new Error(error.message);
  if (data) {
    const users = [...new Set(data.map((row) => row.profile_id))];
    const posts = [...new Set(data.map((row) => row.post_id))];
    const matrix = Array.from({ length: users.length }, () =>
      Array.from({ length: posts.length }, () => 0)
    );
    data.forEach((d) => {
      const userIndex = users.indexOf(d.profile_id);
      const postIndex = posts.indexOf(d.post_id);
      matrix[userIndex][postIndex] = 1;
    });
    const co = recommend.coMatrix(matrix);
    const sample = {
      coMatrix: co,
      ratings: matrix,
      users: users,
      posts: posts,
    };
    cache.set(cacheKey, sample);
    return sample;
  }
}

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(403).send();
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return res.status(403).send();
  const userId = req.body.userId;
  try {
    const sample = await prepareData(supabase);
    const userIndex = sample.users.findIndex((a) => a == userId);
    const isInvalid =
      userIndex == -1 ||
      sample.ratings[userIndex].every((a) => a == 0) ||
      sample.ratings[userIndex].every((a) => a == 1);
    if (isInvalid) return res.json({ posts: [] });
    const rec = recommend.getRecommendations(
      sample.ratings,
      sample.coMatrix,
      userIndex
    );
    return res.json({
      posts: rec.splice(0, 30).map((r) => sample.posts[r]),
    });
  } catch (error) {
    console.log(error);
    return res.json({ posts: [] });
  }
}

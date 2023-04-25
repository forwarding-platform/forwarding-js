import { cache } from "@/libs/lru-cache";
import {
  SupabaseClient,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
const ContentBasedRecommender = require("content-based-recommender");

/**
 *
 * @param {SupabaseClient} supabase
 */
async function prepareData(supabase) {
  const cacheKey = "related-post-recommender";
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log("already have");
    return cachedData;
  }
  const { data, error } = await supabase.from("post").select("id, title");
  if (error) throw new Error(error.message);
  if (data) {
    const documents = data.map((d) => ({ id: d.id, content: d.title }));
    const recommender = new ContentBasedRecommender({
      maxSimilarDocuments: 5,
      minScore: 0,
    });
    recommender.train(documents);
    cache.set(cacheKey, recommender);
    return recommender;
  }
}

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  } else {
    const supabase = createServerSupabaseClient({ req, res });
    const postId = req.body.postId;
    try {
      const recommender = await prepareData(supabase);
      const similarPosts = recommender.getSimilarDocuments(postId);
      return res.status(200).json({
        posts: similarPosts.map((s) => s.id),
      });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ posts: [] });
    }
  }
}

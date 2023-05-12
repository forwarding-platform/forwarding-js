import { cache } from "@/libs/lru-cache";

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
  if (
    req.query.revalidate_key == process.env.REVALIDATE_KEY &&
    req.method == "POST"
  ) {
    cache.clear();
    console.log("cleared");
  }
}

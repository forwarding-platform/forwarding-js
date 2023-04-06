// /**
//  *
//  * @param {import("next").NextApiRequest} req
//  * @param {import("next").NextApiResponse} res
//  * @returns
//  */
// const handler = async (req, res) => {
//   if (req.query.secret !== process.env.REVALIDATE_KEY) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
//   try {
//     await res.revalidate(`/${req.query.root}`);
//     const pathToRevalidate = `/${req.query.root}/${
//       req.body?.record?.id || req.body?.old_record?.id
//     }`;
//     await res.revalidate(pathToRevalidate);

//     return res.send({ revalidated: true });
//   } catch (err) {
//     return res.status(500).send("Error revalidating");
//   }
// };

// export default handler;

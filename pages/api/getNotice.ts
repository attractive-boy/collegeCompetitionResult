import type { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "@/utils/dbConnect";

export default async function getNotice(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title } = JSON.parse(req.body);
  if (title !== undefined) {
    const query = `SELECT id,title,link FROM notice WHERE title LIKE ? ORDER BY id DESC`;
    const values = [`%${title}%`];
    const results = await excuteQuery({ query, values });
    res.status(200).json(results);
    return;
  }
  //把notice表中的数据查询到(按照id排序)
  const query = `SELECT id,title,link FROM notice ORDER BY id DESC`;
  const results = await excuteQuery({ query, values: [] });
  res.status(200).json(results);
}

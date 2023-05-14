import type { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "@/utils/dbConnect";

export default async function deleteNotice(
  req: NextApiRequest,
  res: NextApiResponse
) {
    //根据id删除notice表中的数据
    const { id } = JSON.parse(req.body);
    const sql = `DELETE FROM notice WHERE id = ?`;
    const data = await excuteQuery({ query: sql, values: [id] });
    res.status(200).json(data);
}

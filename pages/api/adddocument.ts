import type { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "@/utils/dbConnect";

export default async function addDocument(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, content, type, time, rank, student, teacher, college } =
    JSON.parse(req.body);
  //time转换为时间戳
  const timestamp = new Date(time)
    .toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(/\//g, "-");
  const sql = `INSERT INTO article (title, content, type, time, \`rank\`, student, teacher, college) VALUES (?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'), ?, ?, ?, ?)`;
  const data = await excuteQuery({
    query: sql,
    values: [title, content, type, timestamp, rank, student, teacher, college],
  });
  res.status(200).json(data);
}

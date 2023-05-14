import type { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "@/utils/dbConnect";

export default async function addNotice(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //新增通知 通知消息 通知链接
    const { title, link } = JSON.parse(req.body);
    let {id} = JSON.parse(req.body);
    if(id){
        const sql = `UPDATE notice SET title = ?,link = ? WHERE id = ?`;
        const data = await excuteQuery({ query: sql, values: [title, link,id] });
        res.status(200).json(data);
        return
    }
    id = new Date().getTime();
    const sql = `INSERT INTO notice (id, title, link) VALUES (?, ?, ?)`;
    const data = await excuteQuery({ query: sql, values: [id, title, link] });
    res.status(200).json(data);
}

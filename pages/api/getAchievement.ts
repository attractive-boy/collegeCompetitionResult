import type { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "@/utils/dbConnect";

export default async function getNotice(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { searchValue, id } = JSON.parse(req.body);
  if (searchValue !== undefined) {
    const sql = `SELECT id,year,project,level,work,student,college,teacher,team FROM achievement WHERE project LIKE ? or work LIKE ? or student LIKE ? or teacher LIKE ? ORDER BY id DESC`;
    // 学生和老师精确查询 用逗号隔开的
    const values = [
      `%${searchValue}%`,
      `%${searchValue}%`,
      `%,${searchValue},%`,
      `%,${searchValue},%`,
    ];
    const results = await excuteQuery({ query: sql, values });
    res.status(200).json(results);
    return;
  } else if (id !== undefined) {
    const sql = `SELECT id,year,project,level,work,student,college,teacher,team,photo FROM achievement WHERE id = ?`;
    const values = [id];
    const results = await excuteQuery({ query: sql, values });
    res.status(200).json(results);
    return;
  }
  //把achievement表中的数据查询到(按照id排序)
  const query = `SELECT id,year,project,level,work,student,college,teacher,team FROM achievement ORDER BY id DESC`;
  const results = await excuteQuery({ query, values: [] });
  res.status(200).json(results);
}

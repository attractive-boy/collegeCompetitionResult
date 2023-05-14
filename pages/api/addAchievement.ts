import type { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "@/utils/dbConnect";

export default async function addAchievement(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //新增成果
  let {
    id,
    year,
    project,
    level,
    work,
    student,
    college,
    teacher,
    team,
    photo,
  } = JSON.parse(req.body);
//   前后都加上,
    student = `,${student},`;
    teacher = `,${teacher},`;
  // 判断id是否存在
  if (id) {
    const sql = `UPDATE achievement SET year = ?,project = ?,level = ?,work = ?,student = ?,college = ?,teacher = ?,team = ?,photo = ? WHERE id = ?`;
    const data = await excuteQuery({
      query: sql,
      values: [
        year,
        project,
        level,
        work,
        student,
        college,
        teacher,
        team,
        photo,
        id,
      ],
    });
    res.status(200).json(data);
    return;
  }
  // id不存在，新增
  const sql = `INSERT INTO achievement (id, year, project, level, work, student, college, teacher, team, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const data = await excuteQuery({
    query: sql,
    values: [
      new Date().getTime(),
      year,
      project,
      level,
      work,
      student,
      college,
      teacher,
      team,
      photo,
    ],
  });
  res.status(200).json(data);
}

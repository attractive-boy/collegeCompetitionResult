import type { NextApiRequest, NextApiResponse } from 'next'
import excuteQuery from '@/utils/dbConnect'

export default async function getList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //把article表中的数据查询到(按照time排序)
  const query = `SELECT id,title,rank,time,type,student,teacher FROM article ORDER BY time DESC`;
  const results = await excuteQuery({ query, values: [] });
  res.status(200).json(results);
}

import type { NextApiRequest, NextApiResponse } from 'next'
import excuteQuery from '@/utils/dbConnect'

export default async function getDocument(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //根据id获取到article表中的content
  const { id } = req.body
  const sql = `SELECT content FROM article WHERE id = ?`
  const data = await excuteQuery({ query: sql, values: [id] })
  res.status(200).json(data)
}

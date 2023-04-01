import type { NextApiRequest, NextApiResponse } from 'next'
import excuteQuery from '@/utils/dbConnect'

export default async function updateDocument(
  req: NextApiRequest,
  res: NextApiResponse
) {
    //根据id更新article表中的content
    const { id, content } = JSON.parse(req.body)
    const sql = `UPDATE article SET content = ? WHERE id = ?`
    const data = await excuteQuery({ query: sql, values: [content, id] })
    res.status(200).json(data)
}

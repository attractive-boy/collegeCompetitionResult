import mysql from 'serverless-mysql'
const db = mysql({
    config: {
      host: '20.120.88.159',
      port: 3306,
      database: 'collegeCompetitionResult',
      user: 'root',
      password: '010294'
    }
  });
export default async function excuteQuery({ query, values }:any) {
    try {
      const results = await db.query(query, values);
      await db.end();
      return results;
    } catch (error) {
      return { error };
    }
}
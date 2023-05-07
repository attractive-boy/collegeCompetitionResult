import mysql from 'serverless-mysql'
const db = mysql({
    config: {
      host: '47.115.206.168',
      port: 3306,
      database: 'collegecompetitionresult',
      user: 'root',
      password: '404NotFound'
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
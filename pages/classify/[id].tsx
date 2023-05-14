import { Layout, theme, List, message, Modal, Button, Input, MenuProps, Menu, Form, DatePicker, InputNumber, Upload, Radio } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { host } from '@/constant';
import Article from '@/components/article';
import { UserOutlined, KeyOutlined, InboxOutlined } from '@ant-design/icons';
import Head from 'next/head';
import convertDocToHtml from '@/utils/convertDocToHtml';
import Router from 'next/router';
import MyHeader from '@/components/MyHeader';
import AchievementTable from '@/components/achievementTable';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query;
  // 请求数据
  const res = await fetch(
      `${host}/api/getAchievement`,
      {
          method: 'POST',
          body: JSON.stringify({id}),
      }
  )
  const data = await res.json();
  return {
      props: {
          data,
      },
  };
};
export default function Home(props: any) {
  const [data, setData] = useState(props.data);
  return (
    <MyHeader>
        {/* 左右结构，左边展示成果照片，右边展示成果信息 */}
        {/* const sql = `INSERT INTO achievement (id, year, project, level, work, student, college, teacher, team, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* 左边展示成果照片 */}
            <div style={{ width: '50%' }}>
                {/* 边框，宽度，高度，居中 */}
                <img src={data[0].photo} style={{ border: '1px solid #ddd', width: '80%', display: 'block', margin: '20px' }}></img>
            </div>
            {/* 右边展示成果信息 内容垂直均匀分布 */}
            <div style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* 竞赛项目 获奖级别 参赛学生 指导老师 */}
                {/* 最右边返回按钮 */}
                <div style={{ textAlign: 'right', margin: '20px' }}>
                    <Button type="primary" onClick={() => Router.back()}>返回</Button>
                </div>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>竞赛项目：{data[0].project}</div>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>获奖级别：{data[0].level}</div>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>参赛学生：{data[0].student}</div>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>指导老师：{data[0].teacher}</div>
                <br></br>
            </div>
        </div>
    </MyHeader>
  )
}

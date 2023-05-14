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
  // 请求数据
  const res = await fetch(
      `${host}/api/getAchievement`,
      {
          method: 'POST',
          body: JSON.stringify({}),
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
  // window.postMessage({ type: 'search', value }, '*')
  useEffect(() => {
    window.addEventListener('message', (e) => {
      if (e.data.type === 'search') {
        const value = e.data.value;
        fetch(`${host}/api/getAchievement`, {
          method: 'POST',
          body: JSON.stringify({ searchValue: value }),
      })
          .then((res) => res.json())
          .then((res) => {
            setData(res);
          });
      }
    });
  }, []);
  return (
    <MyHeader>
      {/* 蓝色的两个通知大字，居中 */}
      <div style={{ textAlign: 'center', fontSize: '3em', color: '#1890ff' }}>
        <div>成果展示</div>
      </div>
      <br></br>
      <div style={{ margin: '0 20px' }}>
      <AchievementTable data={data} admin={false}></AchievementTable>
      </div>
    </MyHeader>
  )
}

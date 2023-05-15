import { Layout, theme, List, message, Modal, Button, Input, MenuProps, Menu, Form, DatePicker, InputNumber, Upload, Radio } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { host } from '@/constant';
import Article from '@/components/article';
import { UserOutlined, KeyOutlined, InboxOutlined } from '@ant-design/icons';
import Head from 'next/head';
import convertDocToHtml from '@/utils/convertDocToHtml';
import Router from 'next/router';
import MyHeader from '@/components/MyHeader';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  // 请求数据
  const res = await fetch(
      `${host}/api/getNotice`,
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
  return (
    <MyHeader>
      {/* 蓝色的两个通知大字，居中 */}
      <div style={{ textAlign: 'center', fontSize: '3em', color: '#1890ff' }}>
        <div>通知</div>
      </div>
      <br></br>
      {/* 一排三个展示，点击跳转到通知详情页 */}
      <div style={{ margin: '0 20px' }}>
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={data}
          renderItem={(item: any, index: any) => (
            <List.Item style={{ textAlign: 'center' }}>
              <a
              style={{ fontSize: '1.5em' , color: 'black' , fontWeight: 'bold' }}
                onClick={() => {
                  // 跳转
                  window.open(item.link);
                }}
                title={item.title}>{item.title}</a>
            </List.Item>
          )}
        />
      </div>
    </MyHeader>
  )
}

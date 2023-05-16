import { Layout, theme, List, message, Modal, Button, Input, MenuProps, Menu, Form, DatePicker, InputNumber, Upload, Radio } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { host } from '@/constant';
import Article from '@/components/article';
import { SearchOutlined, SwapRightOutlined, InboxOutlined } from '@ant-design/icons';
import Head from 'next/head';
import convertDocToHtml from '@/utils/convertDocToHtml';
import Router from 'next/router';
import MyHeader from '@/components/MyHeader';
import { GetServerSideProps } from 'next';

const { Content, Sider } = Layout;

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
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  // 遍历data找到唯一的年份
  const year = new Set();
  data.forEach((item: any) => {
    year.add(item.year);
  });
  const items2: MenuProps['items'] = [
    {
      key: 'year',
      label: '年度',
      icon: <SearchOutlined />,
      children: Array.from(year).map((item: any) => {
        return {
          key: item,
          label: item,
        };
      }),
    },
  ];
  return (
    <MyHeader>
      {/* 蓝色的两个通知大字，居中 */}
      <div style={{ textAlign: 'center', fontSize: '3em', color: '#1890ff' }}>
        <div>通知</div>
      </div>
      <br></br>
      {/* 一排三个展示，点击跳转到通知详情页 */}
        {/* <List
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
        /> */}
        {/* 年度筛选 */}
      <Layout style={{ margin: '0 20px', background: colorBgContainer }}>
          <Sider style={{ background: colorBgContainer }} width={200}>
            {/* 点击筛选 */}
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
              items={items2}
              onClick={(e) => {
                // 筛选
                let data = [...props.data];
                data.forEach((item: any) => {
                  if (item.year != e.key) {
                    item.hide = true;
                  }else{
                    item.hide = false;
                  }
                });
                setData(data);
              }}
            />
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
             <List
              dataSource={data}
              renderItem={(item: any, index: any) => (
                item.hide ? null :
                 <List.Item>
                  <a
                  style={{ fontSize: '1.5em' , color: 'black' }}
                    onClick={() => {
                      // 跳转
                      window.open(item.link);
                    }}
                    title={item.title}><SwapRightOutlined />&nbsp;&nbsp;{item.title}</a>
                </List.Item>
              )}
            />
          </Content>
        </Layout>
    </MyHeader>
  )
}

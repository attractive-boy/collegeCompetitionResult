import { Layout, theme, List, message, Modal, Button, Input, MenuProps, Menu, Form, DatePicker, InputNumber, Upload, Radio } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { host } from '@/constant';
import Article from '@/components/article';
import { UserOutlined, KeyOutlined, InboxOutlined } from '@ant-design/icons';
import Head from 'next/head';
import convertDocToHtml from '@/utils/convertDocToHtml';
import Router, { useRouter } from 'next/router';
import MyHeader from '@/components/MyHeader';

const { Content, Sider } = Layout;
export default function Manage({children}: any) {
    const ManageList = [
        {
            id: 1,
            title: '通知管理',
            url: '/manage/notice',
        },
        {
            id: 2,
            title: '成果管理',
            url: '/manage/achievement',
        },
    ];
    const Router = useRouter();
    const {
        token: { colorBgContainer },
      } = theme.useToken();
    return (
        <MyHeader>
            <Sider style={{ background: colorBgContainer }} width={200}>
            <List
                  dataSource={ManageList}
                  renderItem={(item: any, index: any) => (
                    <List.Item>
                      <a
                    //    根据url判断选中
                        className={Router.pathname === item.url ? 'list active' : 'list'}
                        onClick={() => {
                            // 跳转
                            Router.push(item.url);
                        }}
                        title={item.title}>{item.title}</a>
                    </List.Item>
                  )}
                />
            </Sider>
                {children}
        </MyHeader>
    )
}

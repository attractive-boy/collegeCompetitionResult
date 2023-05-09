import { Layout, theme, List, message, Modal, Button, Input, MenuProps, Menu, Form, DatePicker, InputNumber, Upload, Radio } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { host } from '@/constant';
import Article from '@/components/article';
import { UserOutlined, KeyOutlined, InboxOutlined } from '@ant-design/icons';
import Head from 'next/head';
import convertDocToHtml from '@/utils/convertDocToHtml';
import Router from 'next/router';
import { useRouter } from 'next/router';

const { Content, Sider } = Layout;
const { Header } = Layout;
const { Search } = Input;
const { Dragger } = Upload;

const _userName = 'admin'
const _passwd = 'admin'

//导航头部菜单
const items1: MenuProps['items'] = [
    {
        key: '',
        label: '首页',
    },
    {
        key: 'classify',
        label: '分类',
    },
    {
        key: 'manage',
        label: '管理',
    }
];

export default function MyHeader({ children }: any) {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userName = useRef(null)
    const passwd = useRef(null)
    const [messageApi, contextHolder] = message.useMessage();
    const info = () => {
        messageApi.error('用户名或者密码错误！')
    };
    const login = () => {
        const input: any = userName.current
        const passwdInput: any = passwd.current
        if (input.input.value === _userName && passwdInput.input.value === _passwd) {
            Router.push('/manage')
        } else {
            info()
        }
    }
    const menuClick = (e: any) => {
        // 路由跳转
        if (e.key === '') {
            Router.push('/')
        }
        if (e.key === 'classify') {
            Router.push('/classify')
        }
        if (e.key === 'manage') {
            setIsModalOpen(true)
        }
    }
    let path = useRouter().pathname.replace('/', '')
    return (
        <>
            {contextHolder}
            {/* 登录页面 */}
            <Modal title="登录"
                centered
                open={isModalOpen}
                closable={false}
                footer={
                    <div className="login" style={{ height: 20 }}>
                        <Button type="primary" onClick={() => {
                            login();
                        }}>登录</Button>
                        {/* 取消 */}
                        <Button onClick={() => { setIsModalOpen(false) }}>取消</Button>
                    </div>
                }
            >
                <div>
                    <Input ref={userName} size="large" placeholder="请输入用户名" prefix={<UserOutlined />}
                    />
                    {/* 换行 */}
                    <br />
                    <br />
                    <Input type='password' ref={passwd} size="large" placeholder="请输入密码" prefix={<KeyOutlined />}
                    />
                </div>
            </Modal>
            <Head>
                <title>学科竞赛成果展示</title>
                <meta name="description" content="中南林业科技大学学科竞赛成果展示" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="main">
                <Header className="header">
                    <div className="logo" />
                    {/* 标题：中南林业科技大学学科竞赛成果展示  */}
                    <div className="title">中南林业科技大学学科竞赛成果展示</div>
                    <div className='HeadBar'>
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['index']} items={items1} onClick={menuClick}
                            selectedKeys={[path]}
                        />
                        {/* 分类的情况下影藏搜索框 */}
                        {path === 'classify' ?
                            <Search allowClear placeholder="请输入搜索关键字" size="large"
                                enterButton></Search>
                            : null}
                    </div>
                </Header>
                <Content style={{ padding: '20px 20px' }}>
                    <Layout style={{ padding: '10px 0', background: colorBgContainer, borderRadius: '5px' }}>
                        {children}
                    </Layout>
                </Content>
            </main>
        </>
    )
}

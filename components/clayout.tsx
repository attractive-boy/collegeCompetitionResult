import Head from 'next/head'
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import React from 'react';
import { useRouter } from 'next/router'

const { Header, Content, Footer } = Layout;

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
export default function Clayout({ children }: any) {
    const router = useRouter()
    const menuClick = (e: any) => {
        //跳转页面
        router.push(`/${e.key}`)
    }
    // 高亮选中的菜单项
    const selectedKeys = [router.pathname.split('/')[1]];
    return (
        <>
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
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={items1} onClick={menuClick}
                        selectedKeys={selectedKeys}
                    />
                </Header>
                <Content style={{ padding: '20px 50px' }}>
                    {children}
                </Content>
            </main>
        </>
    )
}

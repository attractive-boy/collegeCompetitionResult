import { Layout, theme, List } from 'antd';
import React from 'react';
import Clayout from '@/components/clayout';
import styles from '@/styles/Home.module.css'

const { Header, Content, Footer, Sider } = Layout;

export default function Home() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Clayout>
      <Layout style={{ padding: '24px 0', background: colorBgContainer }}>
        <Sider style={{ background: colorBgContainer }} width={200}>
          {/* 列表 */}
          <List
            dataSource={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
            renderItem={item => (
              <List.Item>
                <i className={styles.listIcon}></i>
                <a href="https://ant.design">{item}</a>
              </List.Item>
            )}
          />
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          <div className={styles.content}>
            content
          </div>
        </Content>
      </Layout>
    </Clayout>
  )
}

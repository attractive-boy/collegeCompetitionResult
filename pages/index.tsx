import { Layout, theme, List } from 'antd';
import React from 'react';
import Clayout from '@/components/clayout';
import { host } from '@/constant';

const { Content, Sider } = Layout;
//服务端
export async function getServerSideProps() {
  const res = await fetch(`${host}/api/getlist`)
  const data = await res.json()
  return {
    props: {
      data
    }
  }
}

export default function Home(props: any) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [ articleContent, setArticleContent ] = React.useState('');
  const getDocument = () => {
    const url = `/api/getdocument`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: 1 }),
    })
      .then((res) => res.json())
      .then((res) => {
        setArticleContent(res[0].content);
      }
      );
  };
  return (
    <Clayout>
      <Layout style={{ padding: '24px 0', background: colorBgContainer }}>
        <Sider style={{ background: colorBgContainer }} width={200}>
          {/* 列表 */}
          <List
            dataSource={props.data}
            renderItem={(item: any) => (
              <List.Item>
                <a className="list" onClick={getDocument}>{item.title}</a>
              </List.Item>
            )}
          />
        </Sider>
        <Content style={{ minHeight: '70vh' }}>
          <div className="content">
            {articleContent}
          </div>
        </Content>
      </Layout>
    </Clayout>
  )
}

import { Layout, theme, List, message, Modal, Button, Input, MenuProps, Menu, Form, DatePicker, InputNumber, Upload } from 'antd';
import React, { useRef, useState } from 'react';
import { host } from '@/constant';
import Article from '@/components/article';
import { UserOutlined, KeyOutlined, InboxOutlined} from '@ant-design/icons';
import Head from 'next/head';

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

//服务端
export async function getServerSideProps() {
  const res = await fetch(`${host}/api/getlist`)
  const data = await res.json()
  const content = await fetch(`${host}/api/getdocument`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: data[0].id }),
  })
  const articleContent = await content.json();
  return {
    props: {
      data,
      articleContent
    }
  }
}

export default function Home(props: any) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [articleContent, setArticleContent] = React.useState(props.articleContent[0].content);

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
      setIsModalOpen(false)
      setEditArticle(true)
    } else {
      info()
    }
  }

  const menuClick = (e: any) => {
    if (e.key === 'manage') {
      setIsModalOpen(true)
    }
    setSelectedKeys([e.key])
  }
  const [isSearching, setIsSearching] = React.useState(false);

  // 高亮选中的标签
  const [selectedKeys, setSelectedKeys] = React.useState(['']);

  const [editArticle, setEditArticle] = React.useState(false);

  const [showNewArticle, setShowNewArticle] = React.useState(false);

  const newArticle = () => {
    setShowNewArticle(true)
  }

  const saveArticle = () => {
  }

  const deleteArticle = () => {
  }

  const handleEditorChange = (value: any) => {
    setArticleContent(value)
  }
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const [form] = Form.useForm();

  const insertRow = () => {
    console.log(form.getFieldsValue())
  }
  return (
    <>
      {contextHolder}
      {/* 登录页面 */}
      <Modal title="登录"
        centered
        open={isModalOpen}
        closable={false}
        footer={
          <div style={{ width: '100%', height: 20 }}>
            <Button className="login" type="primary" onClick={login}>登录</Button>
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
      <Modal title="上传竞赛成果"
        centered
        open={showNewArticle}
        closable={false}
        footer={null}
      >
        <Form {...layout} style={{ maxWidth: 600 }} form={form} validateMessages={{ required: '${label}必填!' }} name="control-hooks" onFinish={insertRow}>
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true }]}
          >
            <Input placeholder="标题" />
          </Form.Item>
          {/* 学院 */}
          <Form.Item
            label="学院"
            name="college"
            rules={[{ required: true }]}
          >
            <Input placeholder="学院" />
          </Form.Item>
          <Form.Item label="竞赛时间" rules={[{ required: true }]} name="time">
            <DatePicker style={{ width: '100%' }} placeholder="竞赛时间" />
          </Form.Item>
          <Form.Item
            label="竞赛类型"
            rules={[{ required: true }]}
            name="type"
          >
            <Input placeholder="竞赛类型" />
          </Form.Item>
          <Form.Item label="竞赛名次" rules={[{ required: true }]} name="rank">
            {/* 1-1000,无小数点，前面是第字，后面是名 */}
            <InputNumber min={1} max={1000} style={{ width: "100%" }} ></InputNumber>
          </Form.Item>
          <Form.Item label="竞赛参与学生" rules={[{ required: true }]} name="student">
            <Input placeholder="竞赛参与学生" />
          </Form.Item>
          <Form.Item
            label="竞赛辅导老师"
            rules={[{ required: true }]}
            name="teacher"
          >
            <Input placeholder="竞赛辅导老师" />
          </Form.Item>
          <Form.Item
            label="上传竞赛成果"
            name="file"
          >
            {/* 无事件，存储在表单元素中 */}
            <Dragger {...props}
              name="file"
              multiple={false}
              accept=".docx,.doc,.html"
              customRequest={(option:any) => {
                //判断文件类型
                const type = option.file.type
                if (type !== 'application/msword' && type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && type !== 'text/html') {
                  messageApi.error('文件类型不支持！')
                  return
                }
                
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">拖拽文件到此处</p>
              <p className="ant-upload-hint">
                支持点击上传，支持的文件类型为：.docx .doc .html
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
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
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={items1} onClick={menuClick}
              selectedKeys={selectedKeys}
            />
            <Search allowClear placeholder="请输入搜索关键字" loading={isSearching} size="large" enterButton />
          </div>
        </Header>
        <Content style={{ padding: '20px 50px' }}>
          <Layout style={{ padding: '24px 0', background: colorBgContainer }}>
            <Sider style={{ background: colorBgContainer }} width={200}>
              {/* 列表 */}
              <List
                dataSource={props.data}
                renderItem={(item: any) => (
                  <List.Item>
                    <a className="list" onClick={() => {
                      const url = `/api/getdocument`;
                      fetch(url, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: item.id }),
                      })
                        .then((res) => res.json())
                        .then((res) => {
                          setArticleContent(res[0].content);
                        }
                        );
                    }}>{item.title}</a>
                  </List.Item>
                )}
              />
            </Sider>
            <Content style={{ minHeight: '70vh' }}>
              <Article content={articleContent} editArticle={editArticle} newArticle={newArticle} saveArticle={saveArticle} deleteArticle={deleteArticle} handleEditorChange={handleEditorChange}></Article>
            </Content>
          </Layout>
        </Content>
      </main>
    </>
  )
}

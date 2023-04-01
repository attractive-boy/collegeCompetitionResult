import { Layout, theme, List, message, Modal, Button, Input, MenuProps, Menu, Form, DatePicker, InputNumber, Upload, Radio } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { host } from '@/constant';
import Article from '@/components/article';
import { UserOutlined, KeyOutlined, InboxOutlined } from '@ant-design/icons';
import Head from 'next/head';
import mammoth from 'mammoth';

const { Content, Sider } = Layout;
const { Header } = Layout;
const { Search } = Input;
const { Dragger } = Upload;

const _userName = 'admin'
const _passwd = 'admin'

//导航头部菜单
const items1: MenuProps['items'] = [
  {
    key: 'index',
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
  const [listData, setListData] = React.useState(props.data);
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
      setShowClassify(false)
    }
    if (e.key === 'index') {
      setShowClassify(false)
      setEditArticle(false)
    }
    if (e.key === 'classify') {
      setEditArticle(false)
      setShowClassify(true)
      classifyList('time')
    }
    setSelectedKeys([e.key])
  }
  const [isSearching, setIsSearching] = React.useState(false);

  // 高亮选中的标签
  const [selectedKeys, setSelectedKeys] = React.useState(['index']);

  const [editArticle, setEditArticle] = React.useState(false);

  const [showNewArticle, setShowNewArticle] = React.useState(false);

  const newArticle = () => {
    setShowNewArticle(true)
  }
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const [form] = Form.useForm();

  const insertRow = () => {
    // post上传
    const data = form.getFieldsValue()
    // title, content, type, time, rank, student, teacher , college
    fetch(`${host}/api/adddocument`, {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(res => {
      if (res.status === 200) {
        messageApi.success('保存成功！')
        // 关闭弹窗
        setShowNewArticle(false)
        updateList()
      }
    }
    )
  }

  const [isloading, setIsloading] = useState(false)

  const [currentArticleId, setCurrentArticleId] = React.useState(listData[0].id);

  //更新list
  const updateList = () => {
    fetch(`${host}/api/getlist`)
      .then(res => res.json())
      .then(data => {
        setListData(data)
      })
  }

  const [showClassify, setShowClassify] = React.useState(false)

  const [items2, setItems2] = React.useState([])

  //根据类型筛选list赋值给items2
  const classifyList = (type: string) => {
    let arr: any = []
    // 如果是时间，就按照年份分类
    if (type === 'time') {
      listData.forEach((item: any) => {
        arr.push(item[type].slice(0, 4))
      })
    } else {
      listData.forEach((item: any) => {
        arr.push(item[type])
      })
    }
    let newArr = [...new Set(arr)]
    let items: any = []
    newArr.forEach((item: any) => {
      let Chlidren: any = []
      listData.forEach((item2: any) => {
        if (item2[type] === item || (type === 'time' && item2[type].slice(0, 4) === item)) {
          Chlidren.push({
            key: item2.id,
            label: item2.title,
            onClick: () => {
              setIsloading(true);
              const url = `/api/getdocument`;
              fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: item2.id }),
              })
                .then((res) => res.json())
                .then((res) => {
                  setArticleContent(res[0].content);
                  setIsloading(false);
                }
                );
              setCurrentArticleId(item2.id);
            }
          })
        }
      })
      items.push({
        key: item,
        label: item,
        children: Chlidren
      })
    })
    setItems2(items)
  }
  const searchInputChange = (e: any) => {
    if (e === '') {
      setSearchList(null)
      return
    }
    setIsSearching(true)
    //过滤list(支持筛选标题，学生，老师，学院，类型，时间，排名）
    let arr: any = []
    listData.forEach((item: any) => {
      if (item.title.includes(e) || item.student.includes(e) || item.teacher.includes(e) || item.college.includes(e) || item.type.includes(e) || item.time.includes(e)) {
        arr.push(item)
      }
    }
    )
    setSearchList(arr)
    setIsSearching(false)
  }
  const [SearchList, setSearchList] = React.useState(null)
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
            name="content"
          >
            {/* 无事件，存储在表单元素中 */}
            <Dragger {...props}
              name="file"
              multiple={false}
              accept=".docx,.doc,.html"
              customRequest={(option: any) => {
                //判断文件类型
                const type = option.file.type
                if (type !== 'application/msword' && type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && type !== 'text/html') {
                  messageApi.error('文件类型不支持！')
                  return
                }
                //判断文件大小
                const size = option.file.size
                if (size > 1024 * 1024 * 10) {
                  messageApi.error('文件大小不能超过10M！')
                  return
                }
                //如果是html文件，直接读取字符串给表单元素
                if (type === 'text/html') {
                  const reader = new FileReader()
                  reader.readAsText(option.file)
                  reader.onload = (e) => {
                    const html = e.target?.result
                    if (html) {
                      form.setFieldsValue({ content: html })
                    }
                  }
                  //如果是word文件，转换成html字符串给表单元素
                } else {
                  //使用mammoth将word转换成html
                  mammoth.convertToHtml({ arrayBuffer: option.file.arrayBuffer() })
                    .then((result) => {
                      const html = result.value
                      form.setFieldsValue({ content: html })
                    })
                }
                // 上传成功
                option.onSuccess()
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">拖拽文件到此处</p>
              <p className="ant-upload-hint">
                支持点击上传，支持的文件类型为：.docx .doc .html，文件大小不能超过10M
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
            {/* 分类的情况下影藏搜索框 */}
            {!showClassify ?
              <Search allowClear placeholder="请输入搜索关键字" loading={isSearching} size="large"
                enterButton onSearch={
                  searchInputChange
                }></Search>
              : null}
          </div>
        </Header>
        <Content style={{ padding: '20px 50px' }}>
          <Layout style={{ padding: '24px 0', background: colorBgContainer }}>
            <Sider style={{ background: colorBgContainer }} width={200}>
              {/* 列表 */}
              {!showClassify ?
                (<List
                  dataSource={SearchList || listData}
                  renderItem={(item: any, index: any) => (
                    <List.Item>
                      <a
                        // 第一个选中
                        className={index === 0 ? 'list active' : 'list'}
                        onClick={() => {
                          // 给改标签添加样式
                          const list = document.getElementsByClassName('list');
                          for (let i = 0; i < list.length; i++) {
                            list[i].classList.remove('active');
                          }
                          const e = window.event;
                          const target = e?.target as HTMLElement;
                          target.classList.add('active');
                          setIsloading(true);
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
                              setIsloading(false);
                            }
                            );
                          setCurrentArticleId(item.id);
                        }} title={item.title}>{item.title}</a>
                    </List.Item>
                  )}
                />) : (
                  <>
                    <Radio.Group className='Radio-Group' defaultValue="time" buttonStyle="solid"
                      onChange={(e) => {
                        const value = e.target.value;
                        classifyList(value);
                      }}>
                      <Radio.Button value="time">时间</Radio.Button>
                      <Radio.Button value="type">类型</Radio.Button>
                      <Radio.Button value="college">学院</Radio.Button>
                    </Radio.Group>
                    <Menu
                      mode="inline"
                      defaultSelectedKeys={['1']}
                      defaultOpenKeys={['sub1']}
                      style={{ height: '100%' }}
                      items={items2}
                    />
                  </>)}
            </Sider>
            <Content style={{ minHeight: '70vh' }}>
              <Article isLoading={isloading} content={articleContent} editArticle={editArticle} newArticle={newArticle} id={currentArticleId} updateList={updateList}></Article>
            </Content>
          </Layout>
        </Content>
      </main>
    </>
  )
}

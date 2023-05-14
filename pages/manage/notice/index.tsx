import { Layout, theme, List, message, Modal, Button, Input, MenuProps, Menu, Form, DatePicker, InputNumber, Upload, Radio } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { host } from '@/constant';
import Article from '@/components/article';
import { UserOutlined, KeyOutlined, InboxOutlined } from '@ant-design/icons';
import Head from 'next/head';
import convertDocToHtml from '@/utils/convertDocToHtml';
import Router, { useRouter } from 'next/router';
import Manage from '@/components/manageSelect';
import { Typography } from 'antd';
// 服务端渲染
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
export default function notice(props: any) {
    const [data, setData] = useState(props.data);
    const [visible, setVisible] = useState(false);
    // form
    const [form] = Form.useForm();
    const Router = useRouter();
    // 刷新数据
    const refreshData = () => {
        fetch(`${host}/api/getNotice`, {
            method: 'POST',
            body: JSON.stringify({}),
        })
            .then((res) => res.json())
            .then((res) => {
                setData(res);
            }
            );
    };
    return (
        <>
            {/* 弹出对话框，有通知标题和通知链接，确定和取消 */}
            <Modal
                open={visible}
                onOk={() => {
                    // 提交
                    // 发起post请求
                    const values = form.getFieldsValue();
                    fetch(`${host}/api/addNotice`, {
                        method: 'POST',
                        body: JSON.stringify(values),
                    })
                        .then((res) => res.json())
                        .then((res) => {
                            if (res.affectedRows === 1) {
                                message.success('成功');
                                setVisible(false);
                                // 重新请求数据
                                refreshData();
                            } else {
                                message.error('失败');
                            }
                        }
                        );
                }}
                onCancel={() => {
                    // 取消
                    setVisible(false);
                }}
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    initialValues={{ size: 'default' }}
                    form={form}
                >
                    <Form.Item label="通知标题" name="title">
                        <Input />
                    </Form.Item>
                    <Form.Item label="通知链接" name="link">
                        <Input placeholder='http:// or https://开头' />
                    </Form.Item>
                    {/* id */}
                    <Form.Item label="id" name="id" hidden>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Manage>
                {/* 搜索框 */}
                <Content style={{ minHeight: '70vh', padding: '0 20px' }}>
                    <List
                        header={<div>
                            <Input.Search
                                placeholder="搜索以修改或删除通知"
                                enterButton="搜索"
                                size="large"
                                onSearch={(value) => {
                                    // 搜索
                                    // 发起post请求
                                    console.log(value);
                                    fetch(`${host}/api/getNotice`, {
                                        method: 'POST',
                                        body: JSON.stringify({ title: value }),
                                    })
                                        .then((res) => res.json())
                                        .then((res) => {
                                            console.log(res);
                                            if (res.length === 0) {
                                                message.error('没有找到相关通知');
                                            } else {
                                                setData(res);
                                            }
                                        }
                                        );
                                }}
                            />
                            {/* 新建 */}
                            <Button
                                type="primary"
                                size="large"
                                style={{ float: 'right' }}
                                onClick={() => {
                                    // 跳转
                                    // 弹出新建通知的弹窗
                                    form.resetFields();
                                    setVisible(true);
                                }}
                            >
                                新建
                            </Button>
                        </div>}
                        bordered
                        dataSource={data}
                        renderItem={(item: any) =>
                        (
                            <List.Item style={{ textAlign: 'center', position: 'relative', padding: '20px 0', borderBottom: '1px solid #eee' }}>
                                <>
                                    {/* 居中展示data，并且边上有修改和删除a标签 删除是红色的 */}
                                    <Typography.Title level={4} style={{ textAlign: 'center', minWidth: '90%' }}
                                    >{item.title}</Typography.Title>
                                    <a
                                        style={{ float: 'right', color: 'red', marginRight: '20px' }}
                                        onClick={() => {
                                            // 删除
                                            fetch(`${host}/api/deleteNotice`, {
                                                method: 'POST',
                                                body: JSON.stringify({ id: item.id }),
                                            })
                                                .then((res) => res.json())
                                                .then((res) => {
                                                    if (res.affectedRows === 1) {
                                                        message.success('删除成功');
                                                        // 刷新页面
                                                        refreshData();
                                                    } else {
                                                        message.error('删除失败');
                                                    }
                                                });
                                        }}
                                    >
                                        删除
                                    </a>
                                    <a
                                        style={{ float: 'right', marginRight: '20px' }}
                                        onClick={() => {
                                            // 弹出修改通知的弹窗
                                            setVisible(true);
                                            form.setFieldsValue(item);
                                        }}
                                    >
                                        修改
                                    </a>
                                </>
                            </List.Item>
                        )}
                    />
                </Content>
            </Manage>
        </>
    )
}

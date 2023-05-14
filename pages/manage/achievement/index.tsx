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
import { Space, Table, Tag } from 'antd';
// 服务端渲染
import { GetServerSideProps } from 'next';
import AchievementTable from '@/components/achievementTable';

const { Content, Sider } = Layout;
export const getServerSideProps: GetServerSideProps = async (context) => {
    // 请求数据
    const res = await fetch(
        `${host}/api/getAchievement`,
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
    // FileList
    const [fileList, setFileList] = useState([] as any);
    const edit = (record: any) => {
        // 弹出模态框
        setVisible(true);
        // 去掉学生和老师前后的逗号
        //深拷贝
        let values = JSON.parse(JSON.stringify(record));
        values.student = values.student.slice(1, values.student.length - 1);
        values.teacher = values.teacher.slice(1, values.teacher.length - 1);
        // 设置表单的值
        form.setFieldsValue(values);
        // 清空文件
        setFileList([]);
    };
    return (
        <>
            {/* 新增模态框 */}
            <Modal
                title="成果编辑"
                width={800}
                open={visible}
                onCancel={() => {
                    setVisible(false);
                }}
                onOk={() => {
                    // 提交
                    // 发起post请求
                    form.validateFields().then((values: any) => {
                        //学生和老师用数组存储起来
                        values.student = values.student.split(',');
                        values.teacher = values.teacher.split(',');
                        fetch(`${host}/api/addAchievement`, {
                            method: 'POST',
                            body: JSON.stringify(values),
                        })
                            .then((res) => res.json())
                            .then((res) => {
                                console.log(res);
                                if (res.affectedRows === 1) {
                                    message.success('成功');
                                    // 刷新
                                    fetch(
                                        `${host}/api/getAchievement`,
                                        {
                                            method: 'POST',
                                            body: JSON.stringify({}),
                                        }
                                    )
                                        .then((res) => res.json())
                                        .then((res) => {
                                            setData(res);
                                        });
                                } else {
                                    message.error('失败');
                                }
                            });
                    });
                    setVisible(false);
                }}

            >
                {/* 表格 年度（可筛选）竞赛项目 获奖级别（可筛选）获奖作品 获奖学生 学院（可筛选） 指导老师 团队赛或个人赛（可筛选） 操作（修改或删除）宽度保证全部展示出来 */}
                <Form
                    form={form}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    {/* id */}
                    <Form.Item
                        label="id"
                        name="id"
                        hidden
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="年度"
                        name="year"
                        rules={[{ required: true, message: '请输入年度' }]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        label="竞赛项目"
                        name="project"
                        rules={[{ required: true, message: '请输入竞赛项目' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="获奖级别"
                        name="level"
                        rules={[{ required: true, message: '请输入获奖级别' }]}
                    >
                        <Input /></Form.Item>
                    <Form.Item
                        label="获奖作品"
                        name="work"
                        rules={[{ required: true, message: '请输入获奖作品' }]}
                    >
                        <Input /></Form.Item>
                    <Form.Item
                        label="获奖学生"
                        name="student"
                        rules={[{ required: true, message: '请输入获奖学生' }]}
                    // 提示用英文逗号隔开
                    >
                        <Input placeholder='用英文逗号隔开'
                        /></Form.Item>
                    <Form.Item
                        label="学院"
                        name="college"
                        rules={[{ required: true, message: '请输入学院' }]}
                    >
                        <Input /></Form.Item>
                    <Form.Item
                        label="指导老师"
                        name="teacher"
                        rules={[{ required: true, message: '请输入指导老师' }]}
                    >
                        <Input placeholder='用英文逗号隔开'
                        /></Form.Item>
                    <Form.Item
                        label="团队赛或个人赛"
                        name="team"
                        rules={[{ required: true, message: '请输入团队赛或个人赛' }]}
                    >
                        <Input /></Form.Item>
                    {/* 成果照片 */}
                    <Form.Item
                        label="成果照片"
                        name="photo"
                        rules={[{ required: true, message: '请上传成果照片' }]}
                    >
                        <Upload.Dragger name="files"
                            // 限制一个文件
                            maxCount={1}
                            fileList={fileList}
                            //以base64串存储到photo
                            beforeUpload={(file) => {
                                const reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload = () => {
                                    form.setFieldsValue({
                                        photo: reader.result,
                                    });
                                };
                                return false;
                            }}
                            //不上传 只展示
                            customRequest={() => { }}
                            onChange={(info) => {
                                setFileList(info.fileList);
                            }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">点击或拖拽上传</p>
                            <p className="ant-upload-hint">
                                上传成果照片
                            </p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form>
            </Modal>
            <Manage>
                {/* 搜索框 */}
                <Content style={{ minHeight: '70vh', padding: '0 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Input.Search
                            placeholder="搜索以修改或删除成果"
                            enterButton="搜索"
                            size="large"
                            onSearch={(value) => {
                                // 搜索
                                // 发起post请求
                                console.log(value);
                                fetch(`${host}/api/getAchievement`, {
                                    method: 'POST',
                                    body: JSON.stringify({ searchValue: value }),
                                })
                                    .then((res) => res.json())
                                    .then((res) => {
                                        console.log(res);
                                        if (res.length === 0) {
                                            message.error('没有找到相关成果');
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
                            onClick={() => {
                                // 跳转
                                // 弹出新建通知的弹窗
                                form.resetFields();
                                setFileList([]);
                                setVisible(true);
                            }}
                        >
                            新建
                        </Button>
                    </div>
                    <br></br>
                    <AchievementTable data={data} editColumn={edit} admin={true} />
                </Content>
            </Manage>
        </>
    )
}

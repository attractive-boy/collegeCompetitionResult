import { Layout, theme, List, message, Modal, Button, Input, MenuProps, Menu, Form, DatePicker, InputNumber, Upload, Radio, Table, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { host } from '@/constant';
import Article from '@/components/article';
import { UserOutlined, KeyOutlined, InboxOutlined } from '@ant-design/icons';
import Head from 'next/head';
import convertDocToHtml from '@/utils/convertDocToHtml';
import Router, { useRouter } from 'next/router';
import MyHeader from '@/components/MyHeader';

const { Content, Sider } = Layout;
export default function AchievementTable(props: any) {
    const [data, setData] = useState(props.data);
    const editColumn = props.editColumn;
    const admin = props.admin;
    // 父组件修改data
    useEffect(() => {
        setData(props.data);
    }, [props.data]);
    const Router = useRouter();
    return (
        <>
            {/* 表格 年度（可筛选）竞赛项目 获奖级别（可筛选）获奖作品 获奖学生 学院（可筛选） 指导老师 团队赛或个人赛（可筛选） 操作（修改或删除）宽度保证全部展示出来 */}
            <Table dataSource={data} pagination={{ pageSize: 5 }}
                rowKey={(record: any) => record.id}
            >
                <Table.Column title="年度" dataIndex="year" width={100} key={(record) => `${record.id}_col1`} />
                <Table.Column title="竞赛项目" dataIndex="project" key={(record) => `${record.id}_col2`} width={200} />
                <Table.Column title="获奖级别" dataIndex="level" key={(record) => `${record.id}_col3`} width={100} />
                <Table.Column title="获奖作品" dataIndex="work" key={(record) => `${record.id}_col4`} width={100} render={(text, record: any) => (
                    // a标签 浅蓝色 点击跳转
                    <a style={{ color: 'skyblue' }}
                        onClick={() => {
                            //  跳转到文章详情页
                            Router.push(`/classify/${record.id}`);
                        }}>{text}</a>
                )} />
                <Table.Column title="获奖学生" dataIndex="student" key={(record) => `${record.id}_col5`} width={100} render={(text, record: any) => (
                    // 去掉前后两个逗号，其他的逗号都是换行
                    <div>{text.slice(1, text.length - 1).split(',').map((item: any) => {
                        return <div>{item}</div>
                    })}</div>
                )} />
                <Table.Column title="学院" dataIndex="college" key={(record) => `${record.id}_col6`} width={100} />
                <Table.Column title="指导老师" dataIndex="teacher" key={(record) => `${record.id}_col7`} width={100} render={(text, record: any) => (
                    // 去掉前后两个逗号，其他的逗号都是换行
                    <div>{text.slice(1, text.length - 1).split(',').map((item: any) => {
                        return <div>{item}</div>
                    })}</div>
                )} />
                <Table.Column key={(record) => `${record.id}_col8`} title="团队赛或个人赛" dataIndex="team" width={150} />
                // 只有admin才有
                {admin &&
                <Table.Column
                    width={100}
                    title="操作"
                    key={(record) => `${record.id}_col9`}
                    render={(text, record: any) => (
                        <Space size="middle">
                            <a style={{ color: 'skyblue' }}
                                onClick={() => {
                                    editColumn(record);
                                }}>修改</a>
                            <a style={{ color: 'red' }}
                                onClick={() => {
                                    //  删除
                                    fetch(`${host}/api/deleteAchievement`, {
                                        method: 'POST',
                                        body: JSON.stringify({
                                            id: record.id,
                                        }),
                                    })
                                        .then((res) => res.json())
                                        .then((res) => {
                                            if (res.affectedRows === 1) {
                                                message.success('删除成功');
                                                // 重新获取数据
                                                fetch(`${host}/api/getAchievement`)
                                                    .then((res) => res.json())
                                                    .then((res) => {
                                                        setData(res.data);
                                                    });
                                            } else {
                                                message.error('删除失败');
                                            }
                                        });
                                }}>删除</a>
                        </Space>
                    )}
                />
                }
            </Table >
            {/* 新建通知的弹窗 */}
        </>
    )
}

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
    // 生成过滤器对象(年度，获奖级别，学院，团队赛或个人赛)
    const filters = {
        year: [] as any,
        level: [] as any,
        college: [] as any,
        team: [] as any,
    };
    // 给过滤器对象赋值
    data.forEach((item: any) => {
        filters.year.push({
            text: item.year,
            value: item.year,
        });
        filters.level.push({
            text: item.level,
            value: item.level,
        });
        filters.college.push({
            text: item.college,
            value: item.college,
        });
        filters.team.push({
            text: item.team,
            value: item.team,
        });
    });
    // 去重
    filters.year = Array.from(new Set(filters.year));
    filters.level = Array.from(new Set(filters.level));
    filters.college = Array.from(new Set(filters.college));
    filters.team = Array.from(new Set(filters.team));
    return (
        <>
            {/* 表格 年度（可筛选）竞赛项目 获奖级别（可筛选）获奖作品 获奖学生 学院（可筛选） 指导老师 团队赛或个人赛（可筛选） 操作（修改或删除）宽度保证全部展示出来 */}
            <Table dataSource={data} pagination={{ pageSize: 5 }}
                rowKey={(record: any) => record.id}
            >
                {/* 筛选 获取所有年度，竞赛项目，获奖级别，学院，团队赛或个人赛 */}
                <Table.Column title="年度" dataIndex="year" width={100} filters={filters.year} onFilter={(value, record:any) => record.year === value} />
                <Table.Column title="竞赛项目" dataIndex="project" width={200} />
                <Table.Column title="获奖级别" dataIndex="level" width={100} filters={filters.level} onFilter={(value, record:any) => record.level === value} />
                <Table.Column title="获奖作品" dataIndex="work" width={100} render={(text, record: any, index) => (
                    // a标签 浅蓝色 点击跳转
                    <a style={{ color: 'skyblue' }}
                        key={index}
                        onClick={() => {
                            //  跳转到文章详情页
                            Router.push(`/classify/${record.id}`);
                        }}>{text}</a>
                )} />
                <Table.Column title="获奖学生" dataIndex="student" width={100} render={(text, record: any, index) => (
                    // 去掉前后两个逗号，其他的逗号都是换行
                    <div key={index}>{text.slice(1, text.length - 1).split(',').map((item: any) => {
                        return <div key={item}>{item}</div>
                    })}</div>
                )} />
                <Table.Column title="学院" dataIndex="college" width={100} filters={filters.college} onFilter={(value, record:any) => record.college === value} />
                <Table.Column title="指导老师" dataIndex="teacher" width={100} render={(text, record: any, index) => (
                    // 去掉前后两个逗号，其他的逗号都是换行
                    <div key={index}>{text.slice(1, text.length - 1).split(',').map((item: any) => {
                        return <div key={item}>{item}</div>
                    })}</div>
                )} />
                <Table.Column title="团队赛或个人赛" dataIndex="team" width={150} filters={filters.team} onFilter={(value, record:any) => record.team === value} />
                // 只有admin才有
                {admin &&
                    <Table.Column
                        width={100}
                        title="操作"
                        render={(text, record: any, index) => (
                            <Space key={index} size="middle">
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

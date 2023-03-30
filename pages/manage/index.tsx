import { Button, Input, message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Clayout from '@/components/clayout';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';

const _userName = 'admin'
const _passwd = 'admin'

export default function classify() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true)
    }
    const userName = useRef(null)
    const passwd = useRef(null)
    const [messageApi, contextHolder] = message.useMessage();
    const info = () => {
        messageApi.error('用户名或者密码错误！')
    };
    useEffect(() => {
    }, []);
    const login = () => {
        const input: any = userName.current
        const passwdInput: any = passwd.current
        if (input.input.value === _userName && passwdInput.input.value === _passwd) {
            setIsModalOpen(false)
        } else {
            info()
        }
    }
    return (
        <Clayout>
            {contextHolder}
            <Button type="primary" onClick={showModal}>登录</Button>
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
        </Clayout>
    )
}

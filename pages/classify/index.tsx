import { Layout, theme, List, message, Modal, Button, Input, MenuProps, Menu, Form, DatePicker, InputNumber, Upload, Radio } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { host } from '@/constant';
import Article from '@/components/article';
import { UserOutlined, KeyOutlined, InboxOutlined } from '@ant-design/icons';
import Head from 'next/head';
import convertDocToHtml from '@/utils/convertDocToHtml';
import Router from 'next/router';
import MyHeader from '@/components/MyHeader';

export default function Home(props: any) {
  return (
    <MyHeader>
      {/* 蓝色的两个通知大字，居中 */}
      <div style={{ textAlign: 'center', fontSize: '3em', color: '#1890ff' }}>
        <div>通知222</div>
      </div>
    </MyHeader>
  )
}

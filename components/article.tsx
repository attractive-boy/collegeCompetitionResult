import React from 'react';
//引入tinyMCE
import { Editor } from '@tinymce/tinymce-react';
import { Button, message, Popconfirm, Spin } from 'antd';
import { host } from '@/constant';
import { init } from '@/waline/waline.mjs';

export default function article(props: any) {
    // 存储文章内容的
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [content, setContent] = React.useState('');
    const [messageApi, contextHolder] = message.useMessage();
    const [isloading, setIsloading] = React.useState(props.isLoading);
    // 页面全部加载完毕后，初始化waline评论
    React.useEffect(() => {
        if (!isloading && !props.editArticle) {
            //初始化waline评论
            init({
                el: '#comment',
                path: props.id,
                serverURL: `http://20.120.88.159:8360`,
                meta: ['nick', 'mail'],
            });
        }
    }, [isloading])
    // 如果props.isLoading改变，就改变isloading
    React.useEffect(() => {
        setIsloading(props.isLoading);
    }, [props.isLoading])
    const iframeInit = () => {
        //获取.content（iframe）子元素的高度给自己
        const content: any = document.getElementsByClassName('content')[0]
        const contentChild = content.contentWindow.document.body
        content.style.height = contentChild.scrollHeight + 60 + 'px'
    }
    return (
        <div className='showArticle'>
            {/* 如果是isloading，显示loading */}
            {isloading ?
                <div className='loading'>
                    <Spin size='large' />
                </div>
                :
                // 如果不是isloading，显示文章内容
                (props.editArticle ?
                    (
                        <>
                            <div className='toolbar'>
                                {/* 新建 */}
                                <Button type='primary' onClick={props.newArticle}>新建</Button>
                                {/* 保存 */}
                                <Button onClick={() => {
                                    fetch(`${host}/api/updatedocument`, {
                                        method: 'POST',
                                        body: JSON.stringify({ id: props.id, content }),
                                    }).then(res => {
                                        if (res.status === 200) {
                                            messageApi.success('保存成功！')
                                        }
                                    }
                                    )
                                }
                                }>保存</Button>
                                {/* 删除 */}
                                <Popconfirm
                                    title="确定删除吗？"
                                    onConfirm={() => {
                                        fetch(`${host}/api/deletedocument`, {
                                            method: 'POST',
                                            body: JSON.stringify({ id: props.id }),
                                        }).then(res => {
                                            if (res.status === 200) {
                                                messageApi.success('删除成功！')
                                                props.updateList();
                                            }
                                        }
                                        )
                                    }}
                                    okText="是"
                                    cancelText="否"
                                >
                                    <Button type='primary' danger>删除</Button>
                                </Popconfirm>
                            </div>
                            <Editor
                                apiKey='h53l8ewpt6uv6bxgap7um5xfx3e6a37p1b13io4e6rnwt9lz'
                                initialValue={props.content}
                                init={{
                                    height: 600,
                                }}
                                onEditorChange={(content, editor) => {
                                    setContent(content);
                                }}
                            />
                        </>
                    )
                    :
                    (
                        <div className='articleContent'>
                            {/* 文章内容:无滚动条，高度由内容决定 */}
                            <iframe srcDoc={props.content} className='content' title='content' onLoad={iframeInit} />
                            {/* 虚线分割线 */}
                            <div className='line'></div>
                            {/* 评论区 */}
                            <div className='comment' id='comment'></div>
                        </div>
                    )
                )
            }
            {contextHolder}
        </div>
    )
}

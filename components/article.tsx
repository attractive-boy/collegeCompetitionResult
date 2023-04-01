import React from 'react';
//引入tinyMCE
import { Editor } from '@tinymce/tinymce-react';
import { Button, message, Popconfirm, Spin } from 'antd';
import { host } from '@/constant';

export default function article(props: any) {
    // 存储文章内容的
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [content, setContent] = React.useState('');
    const [messageApi, contextHolder] = message.useMessage();
    return (
        <div className='showArticle'>
            {/* 如果是isloading，显示loading */}
            {props.isLoading ?
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
                        <div className='articleContent' dangerouslySetInnerHTML={{ __html: props.content }}>
                        </div>
                    )
                )
            }
            {contextHolder}
        </div>
    )
}

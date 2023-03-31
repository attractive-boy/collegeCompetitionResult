import React from 'react';
//引入tinyMCE
import { Editor } from '@tinymce/tinymce-react';
import { Button } from 'antd';


export default function article(props: any) {
    // 根据id发起请求，获取文章内容
    return (
        <div className='showArticle'>
            {props.editArticle ?
                (
                    <>
                        <div className='toolbar'>
                            {/* 新建 */}
                            <Button type='primary' onClick={props.newArticle}>新建</Button>
                            {/* 保存 */}
                            <Button onClick={props.saveArticle}>保存</Button>
                            {/* 删除 */}
                            <Button type='primary' danger onClick={props.deleteArticle}>删除</Button>
                        </div>
                        <Editor
                            apiKey='h53l8ewpt6uv6bxgap7um5xfx3e6a37p1b13io4e6rnwt9lz'
                            initialValue={props.content}
                            init={{
                                height: 600,
                            }}
                            onEditorChange={props.handleEditorChange}
                        />
                    </>
                )
                :
                (
                    <div className='articleContent' dangerouslySetInnerHTML={{ __html: props.content }}>
                    </div>
                )
            }
        </div>
    )
}

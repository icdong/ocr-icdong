/*
 * @Description: 
 * @Author: Daito Chai
 * @Date: 2020-11-27 20:10:08
 * @LastEditors: Daito Chai
 * @LastEditTime: 2020-11-28 18:19:24
 */
import React, { useState } from 'react';
import './App.css';
import { Upload, message, Button, Input } from 'antd';
import axios from 'axios';

function App() {

    const [APP_ID, setAPP_ID] = useState(null)
    const [API_KEY, setAPI_KEY] = useState(null)
    const [SECRET_KEY, setSECRET_KEY] = useState(null)

    const [textList, setTextList] = useState([])

    const APP_IDChange = (e) => {
        setAPP_ID(e.target.value)
    }
    const API_KEYChange = (e) => {
        setAPI_KEY(e.target.value)
    }
    const SECRET_KEYChange = (e) => {
        setSECRET_KEY(e.target.value)
    }

    const copyText = (index) => {
        const copyEle = document.getElementById('text' + index)
        const range = document.createRange()
        window.getSelection().removeAllRanges()
        range.selectNode(copyEle)
        window.getSelection().addRange(range)
        const copyStatus = document.execCommand("Copy")
        if (copyStatus) {
            message.success('复制成功')
        } else {
            message.fail('复制失败')
        }
        window.getSelection().removeAllRanges()
    }

    const clear = async () => {
        if (textList.length === 0) return
        const filesName = textList.map(item => item.name)
        await axios.post('http://localhost:3000/delete', {
            filesName: filesName
        }).then(res => {
            if (res.data.code === 1000) {
                message.success('清空成功！')
            }
        })

        setTextList([])
    }

    const elements = []
    textList.forEach((item, index) => {
        elements.push(
            <div className="textList" key={item.name}>
                <p>
                    {item.name}图片内容：
                    <Button className="float-right" type="primary" onClick={() => copyText(index)}>复制</Button>
                </p>
                <p id={'text' + index}>
                    {item.text}
                </p>
            </div>
        )
    })

    const props = {
        name: 'file',
        multiple: true,
        action: 'http://localhost:3000/getText',
        showUploadList: false,
        data: {
            APP_ID: APP_ID,
            API_KEY: API_KEY,
            SECRET_KEY: SECRET_KEY,
        },
        onChange(files) {
            if (files.file.status === 'uploading') {
                return;
            }
            if (files.file.status === 'done') {
                textList.push(files.file.response.textItem)
                setTextList([...textList])
            } else if (files.file.status === 'error') {
                message.error(`${files.file.name}识别失败！`);
            }
        },
    }

    return (
        <div className="App">
            百度APP_ID：<Input className="Input" placeholder="请输入百度APP_ID"
                value={APP_ID} onChange={APP_IDChange} />
            百度API_KEY：<Input className="Input" placeholder="请输入百度API_KEY"
                value={API_KEY} onChange={API_KEYChange} />
            百度SECRET_KEY：<Input className="Input" placeholder="请输入百度SECRET_KEY"
                value={SECRET_KEY} onChange={SECRET_KEYChange} />
            <Button className="btn" danger onClick={clear}>清空</Button>
            <Upload {...props} accept=".png, .jpeg, .jpg">
                <Button type="primary">点击上传</Button>
            </Upload>
            {elements}
        </div>
    );
}

export default App;
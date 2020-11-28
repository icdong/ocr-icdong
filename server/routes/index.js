/*
 * @Description:
 * @Author: Daito Chai
 * @Date: 2020-11-27 20:37:18
 * @LastEditors: Daito Chai
 * @LastEditTime: 2020-11-28 18:24:57
 */

const router = require('koa-router')()
const http = require('http');
const fs = require('fs');

const upload = require('./upload')
const AipOcr = require('../ocr').ocr;

router.post('/getText', upload.single('file'), async ctx => {
    const APP_ID = ctx.req.body.APP_ID
    const API_KEY = ctx.req.body.API_KEY
    const SECRET_KEY = ctx.req.body.SECRET_KEY

    const client = new AipOcr(APP_ID, API_KEY, SECRET_KEY);

    let filename = ctx.req.file.filename
    let image = fs.readFileSync(`images/${filename}`);
    let base64Img = Buffer.from(image).toString('base64');

    let { words_result } = await client.generalBasic(base64Img)

    let text = ''
    if (words_result.length > 0) {
        words_result.forEach(item => {
            text += item.words
        })
    }

    ctx.body = {
        textItem: {
            name: filename,
            text: text,
        },
        code: 1000,
        desc: 'success'
    }
})


router.post('/delete', async ctx => {
    console.log()
    let filesName = ctx.request.body.filesName
    if (filesName.length > 0) {
        filesName.forEach(item => {
            fs.unlinkSync(`images/${item}`)
        })
    }
    ctx.body = {
        code: 1000,
        desc: 'success'
    }
})

module.exports = router
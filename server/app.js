/*
 * @Description: 
 * @Author: Daito Chai
 * @Date: 2020-11-27 20:33:42
 * @LastEditors: Daito Chai
 * @LastEditTime: 2020-11-28 18:09:55
 */
const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

const routes = require('./routes')
app.use(routes.routes(), routes.allowedMethods())

app.listen(3000)
console.log("ocr-icdong in run")
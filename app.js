const express = require("express");
const bodyParser = require("body-parser");
let app = express();
const path = require('path')

//登录和页面显示的接口路径
const  manage=require('./router/manage')
const  manages=require('./router/picerp')



//  使用路由 /index 是路由指向名称
app.use(`/manage`,manage)
app.use(`/user`,manages)
app.use('/public', express.static(path.join(__dirname, 'public')));




//配置服务端口 
var server = app.listen(3000, () => {
    const hostname = 'localhost';
    const port = 3000;
    console.log(`Server running at http://${hostname}:${port}/`);
})
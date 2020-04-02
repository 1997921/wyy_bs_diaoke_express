
const express = require('express')
const app = express()

//引入body-parser
// let bodyparser=require('body-parser')
//配置使用art-template模板引擎
app.engine('art',require('express-art-template'));
//express为response响应对象提供了一个方法  render
//render默认不使用，配置了模板引擎就可以
//res.render('html模板名'，{模板数据})
//第一个参数不能写路径，默认回去下个目中的views 目录查找该模板文件
//也就是说express有一个规定，开发人员将所有的视图放到views目录中

//当服务器收到get请求/的时候，指向出路回调函数

//配置post解析
// app.use(bodyparser.urlencoded({extended:false}))
// app.use(bodyparser.json)
app.get('/about', (req, res) =>
   console.log("收到请求"),
   //获取表单请求数据:express没post的API需要借助第三方工具 body-parser  yarn add --save body-parser
   //处理
   //发送请求
   //req.query只能用get请求参数
//    res.rend("nnnn")
   

   
 )


//公开指定目录
app.use('/public/',express.static('./public/'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
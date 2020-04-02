/*
*分析后台的图片的上传功能
*搜索全部图片的功能，并且在后台图片页面展示：/pic
   *按id搜索图片的功能：/pic/pic.id
   *按name搜索图片的功能：/pic/pic.na
*图片上传的功能：/pic/add
*图片修改功能：pic/edit
*图片删除功能：pic/del
*图片上线:pic/up
*图片下线：pic/down
*/ 
const express = require(`express`)
const router = express.Router()
const bodyParser = require("body-parser");
let DB = require("../config/sql")
let fs = require('fs')

let urlencodedParser = bodyParser.urlencoded({extended: false});
//引用session
let session = require("express-session");
let cookieparser = require("cookie-parser")
const PictureManage = require('../services/PictureManage')
let multipart = require('connect-multiparty')
let multipartyMiddleware = multipart()
let multer=require('multer')



//展品的新增
//艺术家的查询
router.all('/manage/product/art_list.do', urlencodedParser, async (req, res) => {
   console.log("对呢")

})


module.exports = router
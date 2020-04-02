const express = require(`express`)
const router = express.Router()
const bodyParser = require("body-parser");
let DB = require("../config/sql")
let fs = require('fs')


//引用session
let session = require("express-session");
let cookieparser = require("cookie-parser")
const PictureManage = require('../services/PictureManage')
let multipart = require('connect-multiparty')
let multipartyMiddleware = multipart()
let multer=require('multer')

/*
*定义一组空来接受数据库的返回值数据
*/
let status = 0;
let pageNum = 1;

// 解析application/json数据
let jsonParser = bodyParser.json();
// 解析application/x-www-form-urlencoded数据
let urlencodedParser = bodyParser.urlencoded({extended: false});

router.use(session({
    secret: "dsafsafsf",		//设置签名秘钥  内容可以任意填写
    cookie: {maxAge: 300 * 800},		//设置cookie的过期时间，例：80s后session和相应的cookie失效过期
    resave: true,			//强制保存，如果session没有被修改也要重新保存
    saveUninitialized: false		//如果原先没有session那么久设置，否则不设置
}))

//读取session
router.get("/select", function (req, res) {
    //查看session
    // console.log(req.session)
    res.send("查询成功")
})

//设置session里面的内容
router.get("/add", function (req, res) {
    //往session里存储数据
    req.session.status = 1;			//loginok:可以是任意内容，可以为true或false
    res.send("添加成功")
})
router.use((req, res, next) => {
    console.log(`home路由执行成功`);
    next()
})

//用户登录接口
router.post('/', urlencodedParser, function (req, res) {
    //取出前端获取的数据
    let data = req.body;
    // console.log(data)
    let name = data.username;
    let pwd = data.password
    //进行验证

    let sql = "select * from userlogin where username='" + name + "' and password='" + pwd + "'"
    DB.query(sql, (err, result) => {
        if (err) throw err;
        // console.log(result)
        //如果连接成功，改变session中status状态
        res.json(
            {
                status: 0,
                msg: "登录成功",
                data:
                    {
                        id: 1,
                        username: "admin",
                        password: "admin",
                        email: "admin@happymmall.co",
                        phone: "13800138333",
                        question: "问题",
                        answer: "答案",
                        role: 1,
                        createTime: 1478422608000,
                        updateTime: 188238680800
                    }
            }
        )
    })

});
//首页展示接口
router.all('/statistic', urlencodedParser, function (req, res) {
    res.json(
        {
            status: 0,
            data: {
                userCount: 200,
                productCount: 282,
                orderCount: 231
            }
        }
    )
})
//退出登录页面
router.all('/logout.do', function (req, res) {
    res.json({
        status: 0
    })
})

//上线或者下线图片的接口
router.all('/product/set_line_status.do', urlencodedParser, function (req, res) {
    //取出前端获取的数据
    // let data = req.body;
    // let productid = data.productId;
    // let product_states = data.status;
    // // console.log(data)


    // //进行数据库连接"update pic set pic_states="'"+product_states+"'" where Match_R=8
    // sql = "update pic set  pic_states='" + product_states + "'where  pic_id='" + productid + "'"
    // DB.query(sql, (err, result) => {
    //     if (err) throw err;
    //     res.json({
    //         status: 0,
    //         data: "操作成功"
    //     })
    // })
});
//轮播图片查询
router.all('/product/search.do', urlencodedParser, function (req, res) {
    let list = [];
    //获取前端提交的内容
    let pic_reserch = req.body;
    // console.log(pic_reserch);
    //判断一下查询方法
    let pic_reserch_fs = "";

    if (pic_reserch.productId === undefined) {
        //说明是按图片名称查询
        pic_reserch_fs = pic_reserch.productName;
        sql = "select * from pic where  pic_name='" + pic_reserch_fs + "'";
    }
    if (pic_reserch.productName === undefined) {
        //说明是按id名称查询
        pic_reserch_fs = pic_reserch.productId;
        sql = "select * from pic where  cateId='" + pic_reserch_fs + "'";
    }

    // console.log(pic_reserch_fs)
    // console.log(pic_reserch)

    DB.query(sql, (err, result) => {
        // console.log(result)
        if (err) throw err;
        //将取出的数据遍历放到list
        result.map((product, index) => {
            // console.log(product)
            list[index] = {
                id: product.pic_id,
                categoryId: product.cateId,
                name: product.pic_name,
                subtitle: product.subtitle,
                location: product.pic_location,
                status: product.pic_states
            }
        })
        res.json({
            status: 0,
            data: {
                pageNum: pageNum,
                pageSize: pageSize,
                orderBy: null,
                startRow: 1,
                list: list,
                firstPage: 1,
                prePage: 0,
                nextPage: 0,
                lastPage: 1,
                isFirstPage: true,
                isLastPage: true,
                hasPreviousPage: false,
                hasNextPage: false,
                navigatepageNums: [1]

            }
        })
    })

});

//后台轮播图片列表信息展示
router.all('/product/list.do', urlencodedParser, async (req, res) => {
    let num = req.body.pageNum;
    if (!num)
        num = 0;
    let d = await PictureManage.get(num);
    res.json({
        status: 0,
        data: {
            pageNum: num, pageSize: 5, size: 5,
            total: d[0].total, list: d
        }
    })
})
//后台查看轮播图片详情
router.all('/product/detail.do', urlencodedParser, async (req, res) => {
    let id = req.body.productId;
    let data = await PictureManage.getOne(id)
    res.json({
        status: 0,
        data
    })

});
//后台轮播图片新增&修改
router.all('/product/add.do', urlencodedParser, async (req, res) => {
    let p = req.body;
    // console.log(p)
    p=JSON.stringify(p)
    p = JSON.parse(p);
    let data = {}
    if (p.id) {
        // console.log(0)
         data = await PictureManage.update(p)
    } else {
        // console.log(1)
        data = await PictureManage.add(p)
    }
    res.json({
        status: 0,
        data:"操作成功"
    })
});
//首页查看首页轮播图
router.all('/product/index.do', urlencodedParser, async (req, res) => {
    let data = await PictureManage.getIndex()
    res.json({
        status: 0,
        data
    })

});
//图片上传
router.post('/product/upload.do', multipartyMiddleware, function (req, res) {
    //打印一下收到的信息
    // console.log(req.files.upload_file.name);
    //上传的文件信息
    let fliesPath = req.files.upload_file.path;
    // console.log(fliesPath)
    //文件名
    var des_file = 'D:/static-diaoke/img/' + "/" + req.files.upload_file.name;

    fs.readFile("0", function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if (err) {
                console.log(err)
            } else {
                response = {
                    message: 'File uploaded successfully',
                    filename: req.files.upload_file.name
                }
                //获取临时路径
                var tmp_path = fliesPath;

                //指定文件上传之后的存储目录
                var target_path = 'D:/static-diaoke/img/' + req.files.upload_file.name;
                var readStream = fs.createReadStream(tmp_path);
                var writeStream = fs.createWriteStream(target_path);
                readStream.pipe(writeStream);
                readStream.on('end', function () {
                    fs.unlinkSync(tmp_path);
                    err ? console.log(err) : sub_pic();
                    function sub_pic() {
                        console.log("存储成功");
                        res.json({
                            status: 0,
                            data: {
                                url: "http://localhost:8001/img/" + req.files.upload_file.name,
                                uri: req.files.upload_file.name
                            }
                        })
                    }


                });
            }
        })
    })
})
//展品图片查询 
router.all('/product/picShowlist.do', urlencodedParser, async (req, res) => {
    let num = req.body.pageNum;
    if (!num)
        num = 0;
    let zp = await PictureManage.get_showpic(num);
    res.json({
        status: 0,
        data: {
            pageNum: num, pageSize: 5, size: 5,
            total: zp[0].total, list: zp
        }
    })


})
//前端展品的展示
router.all('/product/index_showPic.do', urlencodedParser, async (req, res) => {
        let data=JSON.stringify(req.body);
            data=JSON.parse(data)
            // console.log(data)
    let zp = await PictureManage.index_showpic(data);
    res.json({
        status: 0,
        data:{
            list:zp
        }
    })
})
//前端展品的详情页
router.all('/product/index_showdetail.do', urlencodedParser, async (req, res) => {
    let data=JSON.stringify(req.body);
        data=JSON.parse(data)
        // console.log(data)
    let zp = await PictureManage.index_showdetail(data);
    res.json({
        status: 0,
        data:zp
        
    })
})
//前端艺术家展示
router.all('/product/index_artlist.do', urlencodedParser, async (req, res) => {
    let zp = await PictureManage.index_artlist();
    // console.log(zp)
    res.json({
        status: 0,
        data:{
            list:zp
        }
        
    })
})
//前端艺术加详情的展示
router.all('/product/index_artdetail.do', urlencodedParser, async (req, res) => {
    let dataId=JSON.stringify(req.body.dataId)
        dataId=JSON.parse(dataId)
    // console.log(dataId)
    let zp = await PictureManage.index_artdetail(dataId);
    // console.log(zp)
    res.json({
        status: 0,
        data:zp
        
    })
})
//前端首页新闻的展示
router.all("/product/index_newslist.do", urlencodedParser, async (req, res) =>{
    let zp = await PictureManage.index_newslist();
    res.json({
        status: 0,
        data: {
           list:zp
        }
    })
})
//展品详情
router.all('/product/show_detail.do', urlencodedParser, async (req, res) => {
    let id = req.body.productId;
    let data = await PictureManage.Show_detail(id)
    res.json({
        status: 0,
        data
    })

});
//展品的编辑提交
router.all('/product/show_save.do', urlencodedParser, async (req, res) => {
    let list = req.body;
    // console.log(list)
    let data = await PictureManage.Show_save(list)
    res.json({
        status: 0,
        data
    })

});
//展品的新增
router.all('/product/showpic_save.do', urlencodedParser, async (req, res) => {
    let list = req.body;
    let data = await PictureManage.Show_add(list)
    res.json({
        status: 0,
        data:"添加成功"
    })

});

//艺术家的查询
router.all('/product/art_list.do', urlencodedParser, async (req, res) => {
    let showpic_num = req.body.pageNum;
    if (!showpic_num)
    showpic_num = 0;
    let zp = await PictureManage.get_artlist(showpic_num);
    res.json({
        status: 0,
        data: {
            pageNum: showpic_num, pageSize: 5, size: 5,
            total: zp[0].total, list: zp
        }
    })
})
//艺术家详情查询
router.all('/product/art_detail.do', urlencodedParser, async (req, res) => {
        let id = req.body.productId;
        // console.log(id)
        let data = await PictureManage.Art_detail(id)
        res.json({
            status: 0,
             data
         })
    });
//艺术家信息的删除
router.all('/product/art_delete.do', urlencodedParser, async (req, res) => {
        let id = req.body;
        // console.log(id)
        id=JSON.stringify(id)
        id = JSON.parse(id);
        id = id.productId;
        let data = await PictureManage.Art_delete(id)
         res.json({
            status: 0,
            data:"ok"
        })
});
//艺术家信息修改的保存
router.all('/product/artlist_edit.do', urlencodedParser, async (req, res) => {
    let data=req.body;
        data=JSON.stringify(data);
        data=JSON.parse(data);
    // console.log(data)
        data = await PictureManage.Art_edit(data)
        res.json({
            status: 0,
            data: "修改成功"
        })
})

//新闻信息的查询
router.all("/product/news_list.do", urlencodedParser, async (req, res) =>{
    let showpic_num = req.body.pageNum;
    if (!showpic_num)
    showpic_num = 0;
    let zp = await PictureManage.get_newslist(showpic_num);
    res.json({
        status: 0,
        data: {
            pageNum: showpic_num, pageSize:5, size: 5,
            total: zp[0].total, list: zp
        }
    })
})
//新闻详情的查询
router.all('/product/news_detail.do', urlencodedParser, async (req, res) => {
        let id = req.body.productId;
        // console.log(id)
        let data = await PictureManage.News_detail(id)
        res.json({
            status: 0,
             data
         })
});
//新闻信息的删除
router.all('/product/news_delete.do', urlencodedParser, async (req, res) => {
        let id = req.body;
        id=JSON.stringify(id)
        id = JSON.parse(id);
        id = id.productId;
        let data = await PictureManage.news_delete(id)
         res.json({
            status: 0,
            data:"删除成功"
        })
});
//新闻信息的编辑提交
router.all('/product/news_save.do', urlencodedParser, async (req, res) => {
    let data=JSON.stringify(req.body);
    data=JSON.parse(data)
    if(data.id){
        let list = await PictureManage.news_edit(data);
    }else{
        let list = await PictureManage.news_add(data);
    }
    res.json({
        status: 0,
        data:"保存成功"
    })
})
//新闻列表的新增
router.all('/product/news_add.do', urlencodedParser, async (req, res) => {
    let data=JSON.stringify(req.body);
        data=JSON.parse(data);
        // console.log(data)
    // let list = await PictureManage.news_edit(data);
    // res.json({
    //     status: 0,
    //     data:"保存成功"
    // })
})
//用户信息的查询
router.all('/product/user_list.do', urlencodedParser, async (req, res) => {
    let zp = await PictureManage.get_userlist();
    res.json({
        status: 0,
        data: {
              list: zp
        }
    })
})
//用户修改密码的提交
router.all('/product/user_save.do',urlencodedParser, async (req, res) => {
    let userMsg=req.body;
    userMsg=JSON.stringify(userMsg);
    userMsg= JSON.parse(userMsg);
    // console.log(userMsg);
    let productId=userMsg.productId,
        product_set=userMsg. product_set,
        list={
        productId: productId,
        product_set: product_set
    }
    let data = await PictureManage.user_save(list)
    res.json({
       status: 0,
       data:"修改成功"
   })
})



module.exports = router
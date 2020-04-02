const DB = require("./DbService")
const h = require("../config/host")

const get = async (num) => {
    let start = (num - 1) * 5 + "," + num * 5;
    let sql = 'select pic_id id,cateId categoryId,pic_name name,pic_name mainImage,' +
        'pic_location location,pic_states states,subtitle,COUNT(1) OVER() AS total from pic limit ' + start;
    let list = await DB.run(sql)
    list = JSON.stringify(list);
    list = JSON.parse(list);
    return list
}
const getIndex = async () => {
    // let sql = 'select CONCAT(pic_location,pic_name) url from pic where pic_states=0 limit 5';
    let sql = 'select pic_location url from pic where pic_states=0 limit 5';
    let list = await DB.run(sql)

    list = JSON.stringify(list);
    list = JSON.parse(list);
    let a = []
    for (let aa of list) {
        a.push(aa.url)
    }
    return a
}

const getOne = async (id) => {
    let list = await DB.run('select pic_id id,cateId categoryId,pic_name name,pic_location url,pic_states states,subtitle from pic where pic_id=?;', [id])
    list = JSON.stringify(list[0]);
    list = JSON.parse(list);
    return list
}

const add = async (data) => {
    let sql = 'INSERT INTO pic(pic_name,subtitle,pic_location,pic_states,cateId) VALUES ("'+data.name+'","'+data.subtitle+'","'+data.subImages+'","'+data.status+'","'+data.categoryId+'")';
    // console.log(sql)
    let list = await DB.run(sql)
    // list = JSON.stringify(list);
    // list = JSON.parse(list);
    // return list
}

const update = async (data) => {
    let sql = 'update pic set pic_name="'+data.name+'",'+'subtitle="'+data.subtitle+'",'+'pic_location="'+data.subImages+'",'+'pic_states='+data.status+' where pic_id='+data.id;
    // console.log(sql)
    let list = await DB.run(sql)
    list = JSON.stringify(list);
    list = JSON.parse(list);
    return list
}
//前端展品的展示
const index_showpic = async(data) =>{
    let sql = 'select show_id id,show_name name,show_pic mainImage,' +
        'show_title title,show_txt msg  from show_pic where (category="'+data.dataId+'" and states="0")';
    let list = await DB.run(sql)
    // console.log(list)
    list = JSON.stringify(list);
    list = JSON.parse(list);
    return list

}
//前端艺术家的展示
const index_artlist = async() =>{
    let sql = 'select * from artlist ';
    let list = await DB.run(sql)
    list = JSON.stringify(list);
    list = JSON.parse(list);
    return list
}
//前端艺术家详情的展示
const index_artdetail = async(dataId) =>{
    // console.log(dataId)
    let sql = 'select * from artlist where art_id='+dataId;
    let list = await DB.run(sql)
    list = JSON.stringify(list[0]);
    list = JSON.parse(list);
    return list
}
//前端新闻信息的查询
const index_newslist= async() =>{
    let sql = 'select news_id id,news_name name,news_title subtitle,' +
    'detail detail,states,news_data data from news limit 4';
    let list = await DB.run(sql)
    // console.log(list[0].total)
    list = JSON.stringify(list);
    list = JSON.parse(list);
    return list

}
//展品信息的详情
const index_showdetail = async(data) =>{
    let sql = 'select show_name name,show_pic mainImage,' +
        'show_title title,show_txt msg  from show_pic where (category="'+data.route+'" and states="0" and show_id="'+data.id+'")';
    let list = await DB.run(sql)
    list = JSON.stringify(list[0]);
    list = JSON.parse(list);
    return list

}
// 展品信息的查询
const get_showpic = async(num) =>{
    let start = (num - 1) * 5 + "," + num * 5;
    let sql = 'select show_id id,cateId categoryId,show_name name,show_pic mainImage,' +
        'show_title title,states,show_txt msg,category show_catagory,COUNT(1) OVER() AS total from show_pic limit ' + start;
    let list = await DB.run(sql)
    // console.log(list[0].total)
    list = JSON.stringify(list);
    list = JSON.parse(list);
    return list

}
//展品详情
const Show_detail =async(id) =>{
    let list = await DB.run('select show_id id,show_pic url,show_name categoryId,show_name name,states,show_title subtitle,states,show_txt msg,category show_catagory from show_pic where show_id=?;', [id])
    list = JSON.stringify(list[0]);
    list = JSON.parse(list);
    return list
}
//展品编辑保存
const  Show_save = async(list) =>{
    list = JSON.stringify(list);
    list = JSON.parse(list);
    // console.log(list)
   let id       = list.id,
       name     = list.name,
       subtitle = list.subtitle,
       status   = list.status,
       detail   = list.detail,
       crogry   = list.crogry,
       pic      = list.subImages;
       pic_list = JSON.parse(pic),
       subImages_picName = [];
    for(let i=0;i<pic_list.length;i++){
        subImages_picName.push(pic_list[i].url)
    }
    // console.log(crogry)
    //取到所有的元素更新数据库
    list = await DB.run("UPDATE show_pic SET show_name='" + name + "',"+"show_title='"+subtitle+"',"+"states='"+status+"',"+"show_pic='"+subImages_picName+"',"+"show_txt='"+detail+"',"+"category='"+crogry+"'"+" WHERE  show_id=" + id + "")
    list = JSON.stringify(list[0]);
    return list
}
//展品的新增
const Show_add = async(list) => {
    list = JSON.stringify(list);
    list = JSON.parse(list);
    // console.log(list)
  let  name     = list.name,
       subtitle = list.subtitle,
       status   = list.status,
       detail   = list.detail,
       crogry   = list.crogry,
       categoryId = list.createId,
       pic      = list.subImages,
       pic_list = JSON.parse(pic),
       subImages_picName = [];
    for(let i=0;i<pic_list.length;i++){
        subImages_picName.push(pic_list[i].url)
    }
    let sql = 'INSERT INTO show_pic(show_name,show_title,show_pic,states,cateId,show_txt,category) VALUES ("'+name+'","'+subtitle+'","'+subImages_picName+'","'+status+'","'+categoryId+'","'+detail+'","'+crogry+'")';
    list = await DB.run(sql)
    list = JSON.stringify(list);
    list = JSON.parse(list);
    return list
}
//艺术家列表的查询
const get_artlist=async(showpic_num) =>{
    let start = (showpic_num - 1) * 5 + "," + showpic_num * 5;
    let sql = 'select art_id id,art_name name,art_pic url,art_title title,' +
        'detail detail,COUNT(1) OVER() AS total from artlist limit ' + start;
    let list = await DB.run(sql)
    list = JSON.stringify(list);
    list = JSON.parse(list);
    return list
}
//艺术家详情的查询
const Art_detail=async(id) =>{
    let list = await DB.run('select art_id id,art_name name,art_pic url,art_title title,detail detail from artlist where art_id=?;', [id])
    list = JSON.stringify(list[0]);
    list = JSON.parse(list);
    return list
}
//艺术家信息的修改
const Art_edit=async(data) =>{
//    console.log(data);
   let images=JSON.parse(data.subImages),
       subImages_picName=[];
    //    console.log(images)
    for(let i=0;i<images.length;i++){
        subImages_picName.push(images[i].url)
    }
    // console.log(subImages_picName)
   let sql = "UPDATE artlist SET art_name='" + data.name + "',"+"art_title='"+data.subtitle+"',"+"art_pic='"+subImages_picName+"',"+"detail='"+data.detail+"'  WHERE  art_id=" + data.id + "";
   let list = await DB.run(sql)
    list = JSON.stringify(list);
    list = JSON.parse(list);
    return list
}
//艺术家信息的删除
const Art_delete=async(id) =>{
    let list  = await DB.run('delete from artlist where art_id=?;', [id])
    return list;
}
//新闻信息的查询
const get_newslist=async(showpic_num) =>{
    let start = (showpic_num - 1) * 5 + "," + showpic_num * 5;
    let sql = 'select news_id id,news_name name,news_title subtitle,' +
        'detail detail,states,news_data data,COUNT(1) OVER() AS total from news limit ' + start;
    let list = await DB.run(sql)

    list = JSON.stringify(list);
    list = JSON.parse(list);
    return list
}
//新闻信息详情
const News_detail = async(id) =>{
    let list = await DB.run('select news_id id,news_name name,news_title subtitle,states,detail detail,news_data createdata,news_updata updata,upload_name uploadname from news where news_id=?;', [id])
    list = JSON.stringify(list[0]);
    list = JSON.parse(list);
    return list
}
//新闻信息的编辑
const news_edit= async(data) =>{
    let sql = "UPDATE news SET news_name='" + data.name + "',"+"news_title='"+data.subtitle+"',"+"upload_name='"+data.uploadname+"',"+"states='"+data.status+"',"+"detail='"+data.detail+"'  WHERE  news_id=" + data.id + "";
    // console.log(sql)
    let list = await DB.run(sql)
     list = JSON.stringify(list);
     list = JSON.parse(list);
     return list
}
//新闻信息的新增
const news_add= async(data) =>{
    // console.log(data)
    let sql = 'INSERT INTO news(news_name,news_title,upload_name,news_data,news_updata,states,detail) VALUES ("'+data.name+'", "'+data.subtitle+'", "'+data.name+'", "'+data.status+'", "'+data.status+'", "'+data.status+'", "'+data.detail+'")';
    // console.log(sql)
    let list = await DB.run(sql)
     list = JSON.stringify(list);
     list = JSON.parse(list);
     return list
}
//新闻信息的删除
const news_delete =async(id) =>{
    let list  = await DB.run('delete from news where news_id=?;', [id])
    return list;

}
//用户信息列表
const get_userlist = async() =>{
    let sql = 'select userid  id,username  name,password,email,phone from userlogin ';
    let list = await DB.run(sql)
    list = JSON.stringify(list);
    list = JSON.parse(list);
    return list
}
//用户修改密码的提交
const user_save =async(list) =>{
    let setPwd=list.product_set,
        productId=list.productId;
        let sql='update userlogin set  password="'+setPwd+'" where userid='+productId
        // console.log(sql)
        let data = await DB.run(sql)
        data = JSON.stringify(data);
        data = JSON.parse(data);
        return data

}
exports = module.exports = {
      get: get,
      getOne: getOne, 
      add: add,
      update: update,
      getIndex: getIndex,
      get_showpic:get_showpic,
      Show_detail:Show_detail,
      Show_save:Show_save,
      get_artlist:get_artlist,
      Art_detail:Art_detail,
      Art_delete:Art_delete,
      get_newslist:get_newslist,
      News_detail:News_detail,
      news_delete:news_delete,
      get_userlist:get_userlist,
      user_save:user_save,
      Show_add:Show_add,
      Art_edit:Art_edit,
      news_edit:news_edit,
      news_add:news_add,
      index_showpic:index_showpic,
      index_showdetail:index_showdetail,
      index_artlist:index_artlist,
      index_artdetail:index_artdetail,
      index_newslist:index_newslist
    };

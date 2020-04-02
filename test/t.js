let pic = require('../services/PictureManage')

let a =async ()=>{
    let aa = {name:'assssd',location:'asdf',states:1,x_local:'asdfsssss',id:3}
    b = await pic.getOne('0000001');
    console.log(b)
}

a()
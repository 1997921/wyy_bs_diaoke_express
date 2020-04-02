
let mysql = require("mysql");
let db="";
(function sql (){
 db = mysql.createConnection({
    host: "47.98.110.253",
    user: "news",
    password:  "123news",
    port: 3306,
    database: "test",
    useConnectionPooling: true
  })
  db.connect((err) => {
    if (err) throw err;
    console.log("数据库连接成功")
  })


})();
module.exports =db

  
  
  
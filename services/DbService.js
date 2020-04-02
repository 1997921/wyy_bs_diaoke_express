const db = require("../config/sql")

const run = (sql, param) => {
    return new Promise((resolve, reject) => {
        db.query(sql, param, (err, data) => {
            if (!err)
                resolve(data)
            else
                reject(err)
        })
    })
}
const queryAll = (sql) => {
    return new Promise((resolve, reject) => {
        run(sql)
    })
}

exports = module.exports = {run: run};

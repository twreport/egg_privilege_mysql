'use strict';
const Service = require('egg').Service;

class DbService extends Service {
    async getListByPage(db, limit, offset){
        const start = offset * limit;
        const end = start + limit;
        const query = `select * from ${db} limit ${start},${end};`;
        const rows = await this.app.mysql.query(query);
        return rows;
    }
}
module.exports = DbService;
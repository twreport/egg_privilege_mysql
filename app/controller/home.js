'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {

  async index() {
    const { ctx } = this;
    const res = await this.app.mysql.select('auth_users');

    //返回接口规范：
    //正常只需要有data
    //不包含msg，前端vue不弹出
    //包含err,包含msg，前端vue自动弹出警告提示
    //不包含err，包含msg，前端vue自动弹出成功提示
    ctx.body = {
      msg: "已连接数据库！",
      data: res
    };
  }
}

module.exports = HomeController;

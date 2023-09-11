'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {

  async index() {
    const { ctx } = this;
    const res = await this.app.mysql.select('auth_users');

    console.log(this.app.config.appMiddleware);

    //返回接口规范：
    //正常只需要有data
    //不包含msg，前端vue不弹出
    //包含err,包含msg，前端vue自动弹出警告提示
    //不包含err，包含msg，前端vue自动弹出成功提示
    ctx.body = {
      msg: "已连接数据库！ready!OK",
      data: res
    };
  }

  async resetAdmin() {
    const result = await this.app.mysql.delete('auth_role_privilege', {
        role_id: 1
    })
    const privileges = await this.app.mysql.select('auth_privileges');
    for(const privilege of privileges){
      const row = {
        role_id: 1,
        privilege_id: privilege.id
      }
      const res = await this.app.mysql.insert('auth_role_privilege', row);
    }
    this.ctx.body = {
      msg: "超级用户权限已重置！"
    };
  }
}

module.exports = HomeController;

'use strict';

const { Controller } = require('egg');

class UserController extends Controller {

  async getUsersList() {
    const { ctx } = this;
    const limit = ctx.request.body.limit;
    const offset = ctx.request.body.offset;
    const result = await ctx.service.user.getUsersList(limit, offset);
    ctx.body = result;
  }

  async getRoleByUserId() {
    const { ctx } = this;
    const user_id = ctx.request.body.user_id;
    const result = await ctx.service.user.getRoleByUserId(user_id);
    ctx.body = result;
  }

  async changeUserRole() {
    const { ctx } = this;
    const userId = ctx.request.body.changed_user_id;
    const checkedRoleList = ctx.request.body.checkedRoleList;
    const result = await ctx.service.user.changeUserRole(userId, checkedRoleList);
    ctx.body = result;
  }

  async deleteUserById() {
    const { ctx } = this;
    // put和delete需要从params中获得参数
    const user_id = ctx.params.id;
    const result = await ctx.service.user.deleteUserById(user_id);
    ctx.body = result;
  }

  async changeUserStatus() {
    const { ctx } = this;
    const user_id = ctx.request.body.user_id;
    console.log(user_id);
    const row = await this.app.mysql.get('auth_users', {id:user_id});
    if(row.status == 1){
      row.status = 0;
    }else{
      row.status = 1;
    }
    console.log(row);
    const result = await this.app.mysql.update('auth_users', row);
    // 判断更新成功
    const updateSuccess = result.affectedRows === 1;

    if(updateSuccess){
      ctx.body = {
        msg: `已更新用户${row.user_name}的状态！`
      }
    }else{
      ctx.body = {
        msg: `更新状态失败！`,
        error: 500
      }
    }
  }
}

module.exports = UserController;

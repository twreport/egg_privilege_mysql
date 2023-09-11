'use strict';

const { Controller } = require('egg');

class RoleController extends Controller {

  async getRolesList() {
    const { ctx } = this;
    const limit = ctx.request.body.limit;
    const offset = ctx.request.body.offset;
    const result = await ctx.service.role.getRolesList(limit, offset);
    ctx.body = result;
  }

  async deleteRoleById() {
    const { ctx } = this;
    // delete需要从params中获得参数
    const role_id = ctx.params.id;
    const result = await ctx.service.role.deleteRoleById(role_id);
    ctx.body = result;
  }

  async editRole() {
    const { ctx } = this;
    // put需要从body中获得参数
    const role_id = ctx.request.body.form.id;
    const role_name = ctx.request.body.form.role_name;
    const row = {
      'id': role_id,
      'role_name': role_name
    }
    console.log(ctx.request.body);
    console.log(row);
    const result = await this.app.mysql.update('auth_roles', row);
    // 判断更新成功
    const updateSuccess = result.affectedRows === 1;
    if (updateSuccess) {
      ctx.body = {
        msg: '成功更新角色！'
      }
    } else {
      ctx.body = {
        err: 500,
        msg: '更新角色失败！'
      }
    }

  }

  async isRoleNameExist() {
    const { ctx } = this;
    const role_name = ctx.request.body.role_name;
    const result = await this.app.mysql.select('auth_roles', {
      where: { 'role_name': role_name }
    })
    if (result.length > 0) {
      ctx.body = {
        data: {
          is_exist: 1
        }
      };
    } else {
      ctx.body = {
        data: {
          is_exist: 0
        }
      };
    }

  }

  async addRole() {
    const { ctx } = this;
    const role_name = ctx.request.body.role_name;
    const result = await this.app.mysql.insert('auth_roles', { 'role_name': role_name })
    // 判断插入成功
    const insertSuccess = result.affectedRows === 1;
    if (insertSuccess) {
      ctx.body = {
        msg: `已成功添加角色${role_name}！`
      };
    } else {
      ctx.body = {
        err: `添加角色${role_name}失败！`
      }
    }
  }
}


module.exports = RoleController;

'use strict';

const { Controller } = require('egg');

class PrivilegeController extends Controller {

  async getPrivilegeByRoleId() {
    const { ctx } = this;
    const role_id = ctx.request.body.role_id;
    const result = await ctx.service.privilege.getPrivilegeByRoleId(role_id);
    ctx.body = result;
  }


  async getPrivilegeByPrivilegeId() {
    const { ctx } = this;
    const privilege_id = ctx.params.id;
    const row = await this.app.mysql.get('auth_privileges', {id:privilege_id})
    ctx.body = {
      data: row
    };
  }

  async updateRolePrivilege() {
    const { ctx } = this;
    const role_id = ctx.request.body.role_id;
    const role_privilege = ctx.request.body.role_privilege;
    const result = await ctx.service.privilege.updateRolePrivilege(role_id, role_privilege);
    ctx.body = result;
  }

  async getPrivilegeTree() {
    const { ctx } = this;
    const result = await ctx.service.privilege.getPrivilegeTree();
    if (result) {
      ctx.body = {
        data: result
      };
    } else {
      ctx.body = {
        err: 500,
        msg: '读取权限树错误！'
      }
    }
  }

  async isPrivilegeNameExist() {
    const { ctx } = this;
    const privilege_name = ctx.request.body.privilege_name;
    const result = await this.app.mysql.select('auth_privileges', {
      where: { 'privilege_name': privilege_name }
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

  async addPrivilege() {
    const { ctx } = this;
    const form = ctx.request.body.form;
    const result = await this.app.mysql.insert('auth_privileges', form);
    // 判断插入成功
    const insertSuccess = result.affectedRows === 1;
    if (insertSuccess) {
      ctx.body = {
        msg: `已成功添加权限！`
      };
    } else {
      ctx.body = {
        err: `添加权限失败！`
      }
    }
  }

  async deletePrivilegeById(){
    const { ctx } = this;
    // put和delete需要从params中获得参数
    const privilege_id = ctx.params.id;
    const result = await ctx.service.privilege.deletePrivilegeById(privilege_id);
    ctx.body = result;
  }

  async editPrivilege() {
    const { ctx } = this;
    // put需要从body中获得参数
    const row = ctx.request.body.form;
    console.log(ctx.request.body);
    console.log(row);
    const result = await this.app.mysql.update('auth_privileges', row);
    // 判断更新成功
    const updateSuccess = result.affectedRows === 1;
    if (updateSuccess) {
      ctx.body = {
        msg: '成功更新权限！'
      }
    } else {
      ctx.body = {
        err: 500,
        msg: '更新权限失败！'
      }
    }
  }
}

module.exports = PrivilegeController;

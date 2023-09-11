'use strict';
const Service = require('egg').Service;

class RoleService extends Service {
    async getRolesList(limit, offset) {
        const rows = await this.ctx.service.db.getListByPage('auth_roles', limit, offset);
        const count = await this.app.mysql.query('select count(*) from auth_roles');
        console.log(count[0]['count(*)']);
        return {
            data: { 
                'roles_list': rows,
                'roles_count': count[0]['count(*)']
             }
        }
    }

    async deleteRoleById(role_id) {
        //先删除中间表相关数据
        const res1 = await this.app.mysql.delete('auth_user_role', {
            'role_id': role_id
        })
        const res2 = await this.app.mysql.delete('auth_role_privilege', {
            'role_id': role_id
        })
        console.log(res1, res2);
        //再删除角色表相关数据
        const result = await this.app.mysql.delete('auth_roles', {
            'id': role_id
        })
        return {
            msg: '角色已成功删除！'
        }
    }
}

module.exports = RoleService
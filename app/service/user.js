'use strict';
const Service = require('egg').Service;

class UserService extends Service {
    async getUsersList(limit, offset) {
        const rows = await this.ctx.service.db.getListByPage('auth_users', limit, offset);
        const count = await this.app.mysql.query('select count(*) from auth_users');
        console.log(count[0]['count(*)']);
        return {
            data: { 
                'users_list': rows,
                'users_count': count[0]['count(*)']
             }
        }
    }

    async getRoleByUserId(user_id) {
        const roleList = await this.app.mysql.select('auth_roles');

        const role_query = `select u.id,ur.role_id from auth_user_role as ur join auth_users as u on u.id=ur.user_id
        join auth_roles as r on r.id=ur.role_id where u.id=${user_id}`;
        const rows = await this.app.mysql.query(role_query);
        let checkedRoleList = [];
        for(let row of rows){
            checkedRoleList.push(row.role_id)
        }
        return {
            data: {
                roleList,
                checkedRoleList
            }
        }
    }

    async changeUserRole(userId, checkedRoleList) {
        const result = await this.app.mysql.delete('auth_user_role', {
            'user_id': userId
        });
        console.log('delete!');
        console.log(result);

        for(let role_id of checkedRoleList){
            const row = {
                user_id: userId,
                role_id: role_id
            }
            const addResult = await this.app.mysql.insert('auth_user_role', row);
            console.log(addResult);
        }
        return {
            msg: '已成功修改用户权限！'
        }
    }

    async deleteUserById(user_id){
        console.log(user_id);
        // 1-删除中间表
        const result1 = await this.app.mysql.delete('auth_user_role', {
            'user_id': user_id
        });
        console.log(result1);
        // 2-删除用户表
        const result2 = await this.app.mysql.delete('auth_users', {
            'id': user_id
        });

        return {
            msg: '已成功删除用户！'
        }
    }

}
module.exports = UserService;
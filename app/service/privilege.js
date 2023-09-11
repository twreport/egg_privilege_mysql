'use strict';
const Service = require('egg').Service;

class PrivilegeService extends Service {

    async getPrivilegeByRoleId(role_id) {
        const wholePrivilegeTree = await this.getPrivilegeTree();
        const rolePrivilegeList = await this.getRolePrivilegeList(role_id);
        return {
            data: {
                wholePrivilegeTree,
                rolePrivilegeList
            }
        }
    }

    // 取出整棵权限树
    async getPrivilegeTree() {
        let privilege_query = `select * from auth_privileges where parent_id = 0`;

        const privilege_tops = await this.app.mysql.query(privilege_query);
        console.log("privilege_tops:", privilege_tops)
        let role_privilege = []
        for (let p of privilege_tops) {
            let privilege = {
                id: p.id,
                label: p.privilege_name,
            }
            const children = await this.getChildren(p.id);
            if (children.length > 0) {
                privilege['children'] = children
            }
            role_privilege.push(privilege)
        }
        console.log("--------role_privilege---------");
        console.log(role_privilege);
        return role_privilege;
    }

    async getChildren(privilege_id) {
        let children_tree = [];
        const privileges = await this.app.mysql.select('auth_privileges',
            {
                where: {
                    parent_id: privilege_id
                }
            })
        if (privileges.length > 0) {
            for (let privilege of privileges) {
                let p = {
                    id: privilege.id,
                    label: privilege.privilege_name,
                }
                let children = await this.getChildren(privilege.id);
                if (children.length > 0) {
                    p['children'] = children;
                }
                children_tree.push(p);
            }
        }
        console.log(children_tree);
        return children_tree;
    }

    async getRolePrivilegeList(role_id) {
        let query = `select * from auth_role_privilege as rp join auth_roles as r on r.id=rp.role_id join auth_privileges as p on p.id=rp.privilege_id where r.id = ${role_id}`;
        const rows = await this.app.mysql.query(query);
        let rolePrivilegeList = [];
        for (let row of rows) {
            rolePrivilegeList.push(row.id);
        }
        return rolePrivilegeList;
    }

    async updateRolePrivilege(role_id, role_privilege) {
        // 不管三七二十一先把所有该角色权限删除
        // const existRolePrivilege = await this.app.mysql.select('auth_role_privilege', {
        //     where: {'role_id': role_id}
        // })
        // if(existRolePrivilege.length > 0){
            const delResult = await this.app.mysql.delete('auth_role_privilege', {
                'role_id': role_id
            })
            console.log(delResult);
        // }

        // 将所有权限添加到数据库
        for (let rp of role_privilege) {
            const row = {
                'role_id': role_id,
                'privilege_id': rp
            }
            const insertResult = await this.app.mysql.insert('auth_role_privilege', row)
            // 判断插入成功
            const insertSuccess = insertResult.affectedRows === 1;
            console.log(insertSuccess);

        }
        return {
            msg: '已更新角色的权限！'
        }
    }

    async deletePrivilegeById(privilege_id) {
        let result = true;
        //先找出所有子权限
        const delPrivilegeList = await this.pickChildren(privilege_id, []);
        for(let pid of delPrivilegeList){
            const res = await this.delOnePrivilege(pid);
            if(!res){
                result = false;
            }
        }
        if(result){
            return {
                msg: '已成功删除权限！'
            }
        }else{
            return {
                err: 500,
                msg: '删除权限失败！'
            }
        }
    }

    //递归函数，生成所有子权限id的array
    async pickChildren(privilege_id, delPrivilege) {
        if(delPrivilege.indexOf(privilege_id) == -1){
            delPrivilege.push(privilege_id);
        }
        const rows = await this.app.mysql.select('auth_privileges', {
            where: {'parent_id': privilege_id}
        });
        if(rows.length > 0){
            for(let row of rows){
                delPrivilege = await this.pickChildren(row.id, delPrivilege);
            }
        }
        return delPrivilege;
    }

    async delOnePrivilege(privilege_id){
        //先删除中间表
        const res1 = await this.app.mysql.delete('auth_role_privilege', {
            'privilege_id': privilege_id
        })
        //再删除权限表
        const res2 = await this.app.mysql.delete('auth_privileges', {
            'id': privilege_id
        })
        console.log(res1, res2);
        return true;
    }
}

module.exports = PrivilegeService
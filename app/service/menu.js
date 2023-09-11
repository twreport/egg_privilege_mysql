'use strict';
const Service = require('egg').Service;

class MenuService extends Service {
    async getMenuByUserId(user_id) {
        const role_query = `select * from auth_user_role as ur join auth_users as u on u.id=ur.user_id join auth_roles as r on r.id = ur.role_id where u.id=${user_id}`;
        const user_role = await this.app.mysql.query(role_query);
        let user_menu = [];
        let user_permission = [];
        for(let i=0;i<user_role.length;i++)
        {
            // 使用递归函数获得树形菜单
            const user_menu_by_1_role = await this.getMenuByRoleId(user_role[i].role_id);
            for(let menu of user_menu_by_1_role){
                if(user_menu.indexOf(user_menu_by_1_role) == -1){
                    user_menu.push(menu)
                }
            }

            // 获得path字符串数组
            const user_path_by_1_role = await this.getUserPathByRoleId(user_role[i].role_id);
            user_permission = user_permission.concat(user_path_by_1_role);
            console.log(user_permission);

        }
        return {user_menu:user_menu,user_permission:user_permission}
    }

    async getUserPathByRoleId(role_id) {
        const query = `select * from auth_role_privilege as rp join auth_roles as r on r.id=rp.role_id join auth_privileges as p on p.id=rp.privilege_id where r.id = ${role_id} and is_menu = 1`;
        const rows = await this.app.mysql.query(query);
        let user_permission = [];
        for(let row of rows)
        {
            user_permission.push(row.path_name);
        }
        return user_permission;
    }

    async getMenuByRoleId(role_id){
        // 先找出顶级权限
        const privilege_query = `select * from auth_role_privilege as rp join auth_roles as r on r.id=rp.role_id join auth_privileges as p on p.id=rp.privilege_id where r.id = ${role_id} and p.parent_id = 0 and is_menu = 1`;
        const privilege_tops = await this.app.mysql.query(privilege_query);
        console.log(privilege_tops);
        let role_menu = []
        for(let p of privilege_tops){
            let menu = {
                path: p.path_name,
                title: p.button_name,
            }
            const children = await this.getChildren(p.id);
            if(children.length > 0){
                menu['children'] = children
            }
            role_menu.push(menu)
        }
        console.log("--------role_menu_________");
        console.log(role_menu);
        return role_menu;
    }

    async getChildren(privilege_id){
        let children_tree = [];
        const privileges = await this.app.mysql.select('auth_privileges', 
        {
            where:{
                parent_id: privilege_id
            }
        })
        if(privileges.length > 0){
            for(let privilege of privileges){
                let menu = {
                    path: privilege.path_name,
                    title: privilege.button_name,
                }
                let children = await this.getChildren(privilege.id);
                if(children.length > 0){
                    menu['children'] = children;
                }
                children_tree.push(menu);
            }           
        }
        console.log(children_tree);
        return children_tree;
    }
}

module.exports = MenuService;
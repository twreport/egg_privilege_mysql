'use strict';
const Service = require('egg').Service;
const md5 = require('js-md5');

class LoginService extends Service {
    async login(user_name, password) {
        const secret = this.app.config.TokenSecret;
        const md5_password = md5(password + secret);

        console.log('====================');
        console.log(md5_password);
        console.log('====================');
        const row = await this.app.mysql.select('auth_users', {
            where: {
                'user_name': user_name,
                'password': md5_password
            }
        })

        if (row.length > 0) {
            const user_id = row[0].id;
            const timestamp = new Date().getTime();
            const expires = parseInt(timestamp / 1000) + this.app.config.TokenRefreshInterval;
            const access_token = await this.createToken(user_id, secret, timestamp, expires);
            console.log('====================');
            console.log(access_token);
            console.log('====================');
            const result = await this.ctx.service.menu.getMenuByUserId(user_id);
            const user_menu = result.user_menu;
            const user_permission = result.user_permission;
            return {
                msg: `您好！ ${user_name} , 成功登录！ 即将跳转！`,
                data: {
                    'user_name': user_name,
                    'user_id': user_id,
                    'access_token': access_token,
                    'expires': expires,
                    'user_menu': user_menu,
                    'user_permission': user_permission
                }
            }
        } else {
            return {
                err: 404,
                msg: '用户名或密码错误！'
            }
        }
    }

    async createToken(user_id, secret, timestamp, expires) {
        const access_token = md5(secret + timestamp + 'make token') + timestamp;
        const row = {
            access_token,
            user_id,
            expires
        };
        const result = await this.app.mysql.insert('auth_tokens', row);
        if (result.affectedRows === 1) {
            return access_token;
        }
        return false;
    }

    async refresh_token(refresh_token) {
        console.log(refresh_token);
        const row = await this.app.mysql.select('auth_tokens', {
            where: {
                'access_token': refresh_token
            }
        })
        console.log(row)
        if (row.length > 0) {
            const user_id = row[0].user_id;
            const secret = this.app.config.TokenSecret;
            const timestamp = new Date().getTime();
            const expires = parseInt(timestamp / 1000) + this.app.config.TokenRefreshInterval;
            const access_token = await this.createToken(user_id, secret, timestamp, expires);
            return {
                msg: '登录token已更新！',
                data: {
                    'access_token': access_token,
                    'expires': expires
                }
            }
        } else {
            return {
                err: 500,
                msg: '更新token错误！'
            }
        }
    }

    async register(user_name, password) {

        const secret = this.app.config.TokenSecret;
        const md5_password = md5(password + secret);
        const now = (new Date().getTime()) / 1000;
        const row = {
            'user_name': user_name,
            'password': md5_password,
            'add_time': now,
            'status': 1
        }
        // 判断插入成功
        const result = await this.app.mysql.insert('auth_users', row);
        const insertSuccess = result.affectedRows === 1;
        if(insertSuccess) {
            return {
                msg: `用户${user_name}已成功注册，请在登录页面登录！`,
            }
        }else{
            return {
                msg: '内部错误，请联系管理员！',
                err: 400
            }
        }
    }
}

module.exports = LoginService;
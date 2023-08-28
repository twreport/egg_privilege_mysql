'use strict';

const { Controller } = require('egg');

class LoginController extends Controller {

  async login() {
    const { ctx } = this;
    const user_name = ctx.request.body.user_name;
    const password = ctx.request.body.password;
    const result = await ctx.service.login.login(user_name, password);
    ctx.body = result;
  }

  async refresh_token() {
    const { ctx } = this;
    const refresh_token = ctx.request.body.refresh_token;
    console.log(refresh_token);
    const result = await ctx.service.login.refresh_token(refresh_token);
    ctx.body = result;
  }

  async register() {
    const { ctx } = this;
    const user_name = ctx.request.body.user_name;
    const password = ctx.request.body.password;
    const result = await ctx.service.login.register(user_name, password);
    ctx.body = result;
  }

  async is_user_exist() {
    const { ctx } = this;
    const user_name = ctx.request.body.user_name;
    const res = await this.app.mysql.select('auth_users', {
      where: {user_name: user_name}
    });
    if(res.length > 0){
      ctx.body = {
        data: {
          user_id: res[0].id
        }
      }
    }else{
      ctx.body = {
        data: {
          user_id: 0
        }
      }
    }
  }
}


module.exports = LoginController;

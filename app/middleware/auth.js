"use strict";
module.exports = (options, app) => {
  return async function auth1(ctx, next) {
    console.log(options);
    console.log("step1");

    // 获取access_token
    const access_token = ctx.request.header.access_token;
    const token_rows = await app.mysql.select("auth_tokens", {
      where: { access_token: access_token },
    });
    console.log("==================request token================");
    console.log(access_token);
    console.log(token_rows);
    console.log("==================++++++++================");
    // 判断是否存在token
    if (token_rows.length > 0) {
      // 判断是否超时
      const now = new Date().getTime() / 1000;
      console.log(token_rows.expires);
      console.log(now);
      if (token_rows[0].expires > now) {
        //取出路径对应的权限
        let url = ctx.request.url;
        //如果携带参数，只保留根路径
        const urlList = url.split('/');
        url = '/' + urlList[1];
        console.log("================== urls ================");
        console.log(url);
        console.log(urlList);
        console.log("==================++++++++================");


        console.log(url);
        const privilege_rows = await app.mysql.select("auth_privileges", {
          where: { controller_name: url },
        });
        console.log(privilege_rows);
        if (privilege_rows.length > 0) {
          console.log("==================privilege_rows================");
          console.log(privilege_rows);
          console.log(url);
          console.log("==================++++++++================");
          // 判断是否用户是否拥有该权限
          let permisson = false;
          // 获取用户角色
          const role_rows = await app.mysql.select("auth_user_role", {
            where: {
              user_id: token_rows[0].user_id,
            },
          });
          console.log("==================role_rows================");
          console.log(role_rows);
          console.log("==================++++++++================");
          // 遍历角色列表（一个用户可能拥有多个角色）
          for (let role_row of role_rows) {
            console.log('role_row', role_row);
            console.log(privilege_rows)
            const role_privilege = await app.mysql.select(
              "auth_role_privilege",
              {
                where: {
                  role_id: role_row.role_id,
                  privilege_id: privilege_rows[0].id,
                },
              }
            );
            console.log("==================role_privilege================");
            console.log(role_privilege);
            console.log("==================++++++++================");
            if (role_privilege.length > 0) {
              permisson = true;
            }
          }

          if (permisson === false) {
            ctx.body = {
              err: 400,
              msg: "该用户不拥有此权限！",
            };
          } else {
            await next();
            console.log("step2");
          }
        } else {
          ctx.body = {
            err: 400,
            msg: "权限不存在！",
          };
        }
      } else {
        ctx.body = {
          err: 400,
          msg: "token已超时！",
        };
      }
    } else {
      ctx.body = {
        err: 400,
        msg: "token不存在！",
      };
    }
  };
};

/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */

module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {
    // 配置数据库
    mysql: {
      // 单数据库信息配置
      client: {
        // host
        host: "127.0.0.1",
        // 端口号
        port: "3306",
        // 用户名
        user: "myroot",
        // 密码
        password: "Tangwei7311Yeti.",
        // 数据库名
        database: "tang",
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },

    // 配置中间件
    middleware: ['auth'],
    auth: {
      ignore: ['/login', '/register', '/refresh_token', '/reset_admin', '/is_user_exist', '/user', '/home'],
      keywords: 'TEST TANG'
    }

  });

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1692333056703_2846";

  // add your middleware config here
  // config.middleware = [];

  // 自定义端口
  config.cluster = {
    listen: {
      path: "",
      port: 7777,
      hostname: "0.0.0.0",
    },
  };

  //关闭csrf机制
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    TokenRefreshInterval: 2 * 60 * 60,
    TokenSecret: "auth",
  };

  return {
    ...config,
    ...userConfig,
  };
};

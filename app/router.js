'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/login', controller.login.login);
  router.post('/refresh_token', controller.login.refresh_token);
  router.post('/user', controller.login.register);
  router.post('/is_user_exist', controller.login.is_user_exist);
};

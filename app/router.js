'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { router, controller } = app;
  // const auth = app.middleware.auth();
  // router.get('/', auth, controller.home.index);
  router.get('/', controller.home.index);
  router.get('/reset_admin', controller.home.resetAdmin);
  router.get('/privileges_tree', controller.privilege.getPrivilegeTree);
  router.get('/privilege/:id', controller.privilege.getPrivilegeByPrivilegeId);

  router.post('/login', controller.login.login);
  router.post('/refresh_token', controller.login.refresh_token);
  router.post('/user', controller.login.register);
  router.post('/is_user_exist', controller.login.is_user_exist);
  router.post('/users_list', controller.user.getUsersList);
  router.post('/user_status', controller.user.changeUserStatus);
  router.post('/get_role_by_user_id', controller.user.getRoleByUserId);
  router.post('/change_user_role', controller.user.changeUserRole);
  router.post('/roles_list', controller.role.getRolesList);
  router.post('/role', controller.role.addRole);
  router.post('/is_role_name_exist', controller.role.isRoleNameExist);
  router.post('/is_privilege_name_exist', controller.privilege.isPrivilegeNameExist);
  router.post('/privileges_tree', controller.privilege.getPrivilegeByRoleId);
  router.post('/reset_role_privileges', controller.privilege.updateRolePrivilege);
  router.post('/privilege', controller.privilege.addPrivilege);

  router.delete('/user/:id', controller.user.deleteUserById);
  router.delete('/role/:id', controller.role.deleteRoleById);
  router.delete('/privilege/:id', controller.privilege.deletePrivilegeById);

  router.put('/role', controller.role.editRole);
  router.put('/privilege', controller.privilege.editPrivilege);
  
};

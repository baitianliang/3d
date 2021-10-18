export default {
    login: '/uaa' + '/oauth/token',//登录
    // reg: '/user' + '/public/user/reg',

    //个人中心
    userInfo: '/user/common/user/info',//用户信息
    userEditPwd: '/user/common/user/pwd',//用户修改密码
    userEditInfo: '/user/common/user/info/update',//更新用户信息

    //用户管理
    userAdd: '/user' + '/admin/user/add',//添加用户
    userEdit: '/user' + '/admin/user/update',//编辑用户
    userDelete: '/user' + '/admin/user/delete/',//删除用户
    userDeletePlus: '/user' + '/admin/user/delete/plus/',//删除用户
    userClearVender: '/user' + '/admin/user/clear/vender/',//清空用户绑定部门信息
    userList: '/user' + '/admin/user/list/',//用户列表
    userUpdatePwd: '/user' + '/admin/user/pwd',//管理员修改用户密码
    userAdminInfo: 'user' + 'admin/user/info/',//管理获取用户信息

    //用户角色绑定
    userRoleAdd: '/user' + '/admin/user/role/add/',//新建绑定
    userRoleDelete: '/user' + '/admin/user/role/del/',//删除绑定
    userRoleSet: '/user' + '/admin/user/role/set/',//更新绑定 数组
    userRoleSetByList: '/user' + '/admin/user/role/setbylist/',//更新绑定 json
    userRoleList: '/user' + '/admin/user/role/list/',//绑定列表

    //角色管理
    roleAdd: '/user' + '/admin/role/add',//创建角色
    roleEdit: '/user' + '/admin/role/update',//创建角色
    roleDelete: '/user' + '/admin/role/del/',//删除角色
    roleList: '/user' + '/admin/role/list/',//角色列表
    //角色权限绑定
    rolePermissionAdd: '/user' + '/admin/role/permission/add/',//绑定角色、设备、权限
    rolePermissionDelete: '/user' + '/admin/role/permission/del/',//绑定角色、设备、权限
    rolePermissionSet: '/user' + '/admin/role/permission/set/',//绑定角色、多个设备、多个权限  数组格式
    rolePermissionSetByList: '/user' + '/admin/role/permission/setbylist/',//绑定角色、多个设备、多个权限 JSON格式
    rolePermissionListViByRoleId: '/user' + '/admin/role/permission/listViByRoleId/',//角色权限

    //权限管理
    permissionAdd: '/user' + '/admin/permission/add',//创建权限
    permissionEdit: '/user' + '/admin/permission/update',//更新权限
    permissionDelete: '/user' + '/admin/permission/del/',//删除权限
    permissionList: '/user' + '/admin/permission/list/',//权限列表

    //设备管理
    permissionObjectAdd: '/user' + '/admin/permission/object/add',//创建设备
    permissionObjectEdit: '/user' + '/admin/permission/object/update',//更新设备
    permissionObjectDelete: '/user' + '/admin/permission/object/del/',//删除设备
    permissionObjectList: '/user' + '/admin/permission/object/list/',//设备列表

    //部门管理
    venderAdd: '/user' + '/admin/vender/add',//新建部门
    venderEdit: '/user' + '/admin/vender/update',//编辑部门
    venderDelete: '/user' + '/admin/vender/del/',//删除商户
    venderList: '/user' + '/admin/vender/list/',//部门列表
    venderClearUser: '/user' + '/admin/vender/clear/user/',//清空部门下绑定所有用户

    //报警消息信息
    alarmMessageAdd: '/user'+ '/admin/message/alarm/add',//添加报警信息
    alarmMessageClear: '/user'+ '/admin/message/alarm/clear',//清空报警信息
    alarmMessageList: '/user'+ '/admin/message/listbyreceiverid/daping/',//报警信息列表
    alarmMessageEdit: '/user'+ '/admin/message/alarm/processed/',//修改报警信息
    alarmMessageDelete: '/user'+ '/admin/message/alarm/delete/',//删除报警信息


    getMessage: '/alert/get_message'
}

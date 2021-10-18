import Vue from 'vue'
import VueRouter from 'vue-router'
import visual from '../views/visual.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/department'
        // redirect: '/ws'
    },
    {
        path: '/',
        component: () => import('../views/index.vue'),
        children: [
            {
                path: '/statistics',
                name: 'statistics',
                meta: {
                    name: '数据统计'
                },
                component: () => import('../views/manage/index.vue')
            },
            {
                path: '/department',
                name: 'department',
                meta: {
                    name: '部门管理'
                },
                component: () => import('../views/manage/department.vue')
            },
            {
                path: '/role',
                name: 'role',
                meta: {
                    name: '角色管理'
                },
                component: () => import('../views/manage/role.vue')
            },
            {
                path: '/users',
                name: 'users',
                meta: {
                    name: '用户管理'
                },
                component: () => import('../views/manage/users.vue')
            },
            {
                path: '/equipment',
                name: 'equipment',
                meta: {
                    name: '权限对象'
                },
                component: () => import('../views/manage/equipment.vue')
            },
            {
                path: '/equipmentType',
                name: 'equipmentType',
                meta: {
                    name: '设备类型'
                },
                component: () => import('../views/manage/equipmentType.vue')
            },
            {
                path: '/equipmentInventory',
                name: 'equipmentInventory',
                meta: {
                    name: '设备库存'
                },
                component: () => import('../views/manage/equipmentInventory.vue')
            },
            {
                path: '/equipmentCategory',
                name: 'equipmentCategory',
                meta: {
                    name: '设备类别'
                },
                component: () => import('../views/manage/equipmentCategory.vue')
            },
            {
                path: '/equipmentInfo',
                name: 'equipmentInfo',
                meta: {
                    name: '设备信息'
                },
                component: () => import('../views/manage/equipmentInfo.vue')
            },
            {
                path: '/equipmentTransfers',
                name: 'equipmentTransfers',
                meta: {
                    name: '设备调拨'
                },
                component: () => import('../views/manage/equipmentTransfers.vue')
            },
            {
                path: '/equipmentRepair',
                name: 'equipmentRepair',
                meta: {
                    name: '设备报修'
                },
                component: () => import('../views/manage/equipmentRepair.vue')
            },
            {
                path: '/equipmentScrapping',
                name: 'equipmentScrapping',
                meta: {
                    name: '设备报废'
                },
                component: () => import('../views/manage/equipmentScrapping.vue')
            },
            {
                path: '/permission',
                name: 'permission',
                meta: {
                    name: '权限管理'
                },
                component: () => import('../views/manage/permission.vue')
            },
            {
                path: '/alarmManagement',
                name: 'alarmManagement',
                meta: {
                    name: '报警管理'
                },
                component: () => import('../views/manage/alarmManagement.vue')
            },
            {
                path: '/message',
                name: 'message',
                meta: {
                    name: '消息管理'
                },
                component: () => import('../views/manage/message.vue')
            },
        ]
    },
    {
        path: '/visual',
        name: 'visual',
        component: () => import('../views/visual.vue')
    },
    {
        path: '/visual3D',
        name: 'visual3D',
        component: () => import('../views/visual3D.vue')
    },
    {
        path: '/visualWait',
        name: 'visualWait',
        component: () => import('../views/visualWait.vue')
    },
    {
        path: '/tunnel',
        name: 'tunnel',
        component: () => import('../views/tunnel.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login.vue')
    },


]

const router = new VueRouter({
    mode: 'history',
    // base: 'shandong',
    base: '',
    routes
})

export default router

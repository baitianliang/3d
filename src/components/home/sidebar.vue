<template>
    <div id="sidebar">
        <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" :collapse="true"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffffff"
                 @select="selectMenu">
            <el-menu-item index="1">
                <i class="el-icon-location"></i>
                <!--<span slot="title">导航一</span>-->
            </el-menu-item>
            <el-menu-item index="2">
                <i class="el-icon-menu"></i>
            </el-menu-item>
            <!--            <el-menu-item index="3">-->
            <!--                <i class="el-icon-document"></i>-->
            <!--            </el-menu-item>-->
            <el-menu-item index="4">
                <i class="el-icon-setting"></i>
            </el-menu-item>
        </el-menu>
        <div class="menu" ref="menu">
            <div v-for="(item,index) in sidebarList"
                 :key="index">
                <div :class="item.id == current && !item.child?'menu-item is-active':'menu-item'" @click="item.child ? showChild(item,index) : routerClick(item)">
                    {{item.title}}
                    <i v-if="item.child" class="el-icon-arrow-up" :class="item.showChildMenu ? 'icon' : 'icon-animation'"></i>
                </div>
                <div class="menu-item-child" v-show="item.child && item.showChildMenu">
                    <div :class="_item.id == current?'menu-item menu-item-child-item is-active':'menu-item menu-item-child-item'" v-for="(_item,_index) in item.child"
                        :key="_index" @click="routerClick(_item)">
                        <span>{{_item.title}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "sidebar",
        data() {
            return {
                defaultActive: '1',
                isMenu: true,
                sidebarList: [],
                sidebarData: [
                    {
                        icon: '',
                        roleId: 1,
                        sub: [
                            {
                                path: '/statistics',
                                title: '数据统计',
                                id: 1
                            },
                            {
                                path: '/department',
                                title: '部门管理',
                                id: 2
                            },
                            {
                                path: '/users',
                                title: '用户管理',
                                id: 3
                            },
                            {
                                path: '/role',
                                title: '角色管理',
                                id: 4
                            },
                            {
                                path: '/permission',
                                title: '权限管理',
                                id: 5
                            },
                            {
                                path: '/equipment',
                                title: '权限对象',
                                id: 6
                            },
                            // {
                            //     path: '/alarmManagement',
                            //     title: '报警管理'
                            // },
                            {
                                path: '/message',
                                title: '消息管理',
                                id: 7
                            },
                            {
                                path: '/equipmentType',
                                title: '设备类型',
                                id: 8
                            },
                            {
                                path: '/equipmentCategory',
                                title: '设备类别',
                                id: 9
                            },
                            {
                                path: '/equipmentInfo',
                                title: '设备信息',
                                id: 10
                            },
                        ]
                    },
                    {
                        icon: '',
                        roleId: 1,
                        sub: [
                            {
                                // title: '设备管理',
                                // showChildMenu: false, //二级导航显示
                                // child: [{
                                    path: '/equipmentInventory',
                                    title: '设备库存',
                                    id: 11
                                },{
                                    path: '/equipmentTransfers',
                                    title: '设备调拨',
                                    id: 12
                                },{
                                    path: '/equipmentRepair',
                                    title: '设备报修',
                                    id: 13
                                },{
                                    path: '/equipmentScrapping',
                                    title: '设备报废',
                                    id: 14
                                // }]
                            },

                        ]
                    },
                    {
                        icon: '',
                        roleId: 1,
                        sub: [
                            {
                                path: '/',
                                title: '部门管理2'
                            },
                            {
                                path: '/',
                                title: '角色管理2'
                            },
                            {
                                path: '/',
                                title: '用户管理2'
                            },
                            {
                                path: '/',
                                title: '设备管理2'
                            },
                            // {
                            //     path: '/',
                            //     title: '报警管理2'
                            // },

                        ]
                    },
                    {
                        icon: '',
                        roleId: 1,
                        sub: [
                            {
                                path: '/',
                                title: '部门管理3'
                            },
                            {
                                path: '/',
                                title: '角色管理3'
                            },
                            {
                                path: '/',
                                title: '用户管理3'
                            },
                            {
                                path: '/',
                                title: '设备管理3'
                            },
                            // {
                            //     path: '/',
                            //     title: '报警管理3'
                            // },

                        ]
                    },
                    {
                        icon: '',
                        roleId: 1,
                        sub: [
                            {
                                path: '/',
                                title: '部门管理4',
                            },
                            {
                                path: '/',
                                title: '角色管理4'
                            },
                            {
                                path: '/',
                                title: '用户管理4'
                            },
                            {
                                path: '/',
                                title: '设备管理4'
                            },
                            // {
                            //     path: '/',
                            //     title: '报警管理4'
                            // },

                        ]
                    },
                ],
                current: 0,
            }
        },
        methods: {
            showChild(val, index) {
                this.sidebarList[index].showChildMenu = !this.sidebarList[index].showChildMenu
            },
            selectMenu(index) {
                if (this.defaultActive === index) {
                    this.isMenu = !this.isMenu;
                    if (this.isMenu) {
                        this.$refs.menu.style.width = '0.98958rem';
                    } else {
                        this.$refs.menu.style.width = '0';
                    }
                } else {
                    this.isMenu = true;
                    this.$refs.menu.style.width = '0.98958rem';
                    this.current = 0;
                }
                this.$emit('getSidebarW', this.isMenu);
                this.defaultActive = index;
            },
            sidebarChangle() {
                // this.sidebarList = this.sidebarData[this.defaultActive - 1].sub
                if(localStorage.userName === "root") this.sidebarList = this.sidebarData[0].sub;
                else this.sidebarList = this.sidebarData[1].sub;
                this.sidebarList.forEach(item => {
                    if (this.$route.path === item.path) {
                        this.current = item.id;
                    }
                })

                // this.$router.push({
                //     path: this.sidebarList[0].path,
                // })
            },
            routerClick(item) {
                this.$router.push({
                    path: item.path
                })
                this.current = item.id
            },
        },
        mounted() {
            this.sidebarChangle();
        },
        watch: {
            defaultActive(newVal, oldVla) {
                this.sidebarChangle();
            },
        },
    }
</script>

<style lang="scss" scoped>
    #sidebar {
        display: flex;
        height: 100%;
    }

    .menu {
        width: 190px;
        overflow: hidden;
        border: none;
        background-color: #ffffff;
        padding: 20px 0;
        font-size: 14px;

        transition: width 0.4s;
        transition-timing-function: ease;
        -moz-transition: width 0.4s; /* Firefox 4 */
        -moz-transition-timing-function: ease;
        -webkit-transition: width 0.4s; /* Safari and Chrome */
        -webkit-transition-timing-function: ease;
        -o-transition: width 0.4s; /* Opera */
        -o-transition-timing-function: ease;

        .menu-item {
            width: 190px;
            height: 40px;
            line-height: 40px;
            white-space: nowrap;
            text-align: center;
            margin: 15px 0;
            cursor: pointer;
            .el-icon-arrow-up {
                margin-left: 5px;
            }
            .icon {
                transition: 0.5s linear;
                -moz-transition: 0.5s linear; /* Firefox 4 */
                -webkit-transition: 0.5s linear; /* Safari and Chrome */
                -o-transition: 0.5s linear; /* Opera */
            }
            .icon-animation {
                -webkit-transform:rotate(180deg);
                transform:rotate(180deg);
                -webkit-transition:-webkit-transform 0.5s linear;
                transition: transform 0.5s linear;
                -moz-transition: transform 0.5s linear; /* Firefox 4 */
                -webkit-transition: transform 0.5s linear; /* Safari and Chrome */
                -o-transition: transform 0.5s linear; /* Opera */
                // transform: rotateX(180deg);
            }
            .menu-item-child {
            }
        }
        .menu-item-child-item {
            margin-left: 10px;
        }

        .menu-item:hover {
            background-color: #eeeeee;
        }

    }

    .el-menu {
        border: none;
        padding: 25px 0;
        width: 95px;
    }

    .el-menu-item {
        text-align: center;

    }

    .el-menu-item.is-active {
        border-left: 3px solid #0197f7;
    }

    .menu-item.is-active {
        color: #0197f7;
        /*background-color: #eeeeee;*/
    }
</style>

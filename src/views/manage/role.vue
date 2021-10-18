<template>
    <div id="role">
        <!--        <div class="search">-->
        <!--            <el-form :inline="true" :model="condition" label-width="80px">-->
        <!--                <div>-->
        <!--                    <el-form-item label="角色名称">-->
        <!--                        <el-select v-model="condition.role" placeholder="请选择角色">-->
        <!--                            <el-option-->
        <!--                                    v-for="item in roleList"-->
        <!--                                    :key="item.value"-->
        <!--                                    :label="item.label"-->
        <!--                                    :value="item.value">-->
        <!--                            </el-option>-->
        <!--                        </el-select>-->
        <!--                    </el-form-item>-->
        <!--                    <el-form-item label="职务">-->
        <!--                        <el-select v-model="condition.duty" placeholder="请选择职务">-->
        <!--                            <el-option-->
        <!--                                    v-for="item in dutyList"-->
        <!--                                    :key="item.value"-->
        <!--                                    :label="item.label"-->
        <!--                                    :value="item.value">-->
        <!--                            </el-option>-->
        <!--                        </el-select>-->
        <!--                    </el-form-item>-->
        <!--                    <el-form-item label=" ">-->
        <!--                        <el-button @click="getUser">查询</el-button>-->
        <!--                    </el-form-item>-->

        <!--                </div>-->
        <!--            </el-form>-->
        <!--        </div>-->
        <div class="btns">
            <el-button round size="mini" @click="dialogVisible = true">创建</el-button>
<!--            <el-button type="danger" plain round size="mini">删除</el-button>-->
        </div>
        <div class="table">
            <el-table
                    ref="multipleTable"
                    :data="roleList"
                    height="100%"
                    tooltip-effect="dark"
                    style="width: 100%"
                    :header-cell-style="{textAlign:'center',backgroundColor:'#F6F6F6'}"
                    :cell-style="{textAlign:'center'}"
                    @selection-change="handleSelectionChange">
<!--                <el-table-column-->
<!--                        label="选项"-->
<!--                        type="selection"-->
<!--                        width="100">-->
<!--                </el-table-column>-->
                <el-table-column
                        label="序号"
                        type="index"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="roleName"
                        label="角色名称"
                        width="200">
                </el-table-column>
<!--                <el-table-column-->
<!--                        label="状态"-->
<!--                        width="200">-->
<!--                </el-table-column>-->
                <el-table-column
                        prop="roleDesc"
                        label="备注"
                        width="300">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="400"
                        min-width="200"
                >
                    <template slot-scope="scope">
                        <div class="operation">
                            <el-button type="text" icon="el-icon-delete" @click="deleteClick(scope.row)">删除</el-button>
                            <el-button type="text" icon="el-icon-delete" @click="accreditClick(scope.row)">授权
                            </el-button>
                            <!--                            <el-button type="text" icon="el-icon-edit-outline" @click="forbiddenClick(scope.row)">禁用-->
                            <!--                            </el-button>-->
                            <el-button type="text" icon="el-icon-user-solid" @click="editClick(scope.row)">编辑
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column

                ></el-table-column>
            </el-table>
        </div>
        <pagination :total="total" @paginationChange="paginationChange" ref="pagination"></pagination>

        <el-dialog
                :title="isAdd?'创建角色':'编辑角色'"
                :visible.sync="dialogVisible"
                width="2.6rem"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @close="handleClose">

            <el-form class="roleForm" :inline="true" ref="roleForm" :rules="rules" :model="roleForm" label-width="0.46875rem">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
<!--                <el-form-item label="状态">-->
<!--                    <el-radio-group v-model="roleForm.roleStatus">-->
<!--                        <el-radio label="active">启用</el-radio>-->
<!--                        <el-radio label="inactive">禁用</el-radio>-->
<!--                    </el-radio-group>-->
<!--                </el-form-item>-->

                <el-form-item label="备注">
                    <el-input type="textarea" :autosize="{minRows:3,maxRows:6}" resize="none"
                              v-model="roleForm.roleDesc" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="roleFormSubmit">确 定</el-button>
  </span>
        </el-dialog>

        <el-dialog
                title="划分权限"
                :visible.sync="accessVisible"
                width="32vw"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @close="accessHandleClose">
            <div class="accessDialog">
                <div>
                    <el-checkbox :indeterminate="isIndeterminate1" v-model="checkAll1"
                                 @change="handleCheckAllChange1">设备列表
                    </el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="accessForm.equipment" @change="handleCheckedCitiesChange1">
                        <el-checkbox v-for="item in equipmentList" :label="item.permissionObjectId"
                                     :key="item.permissionObjectId">{{item.permissionObjectName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
                <div>
                    <div>
                        <el-checkbox :indeterminate="isIndeterminate2" v-model="checkAll2"
                                     @change="handleCheckAllChange2">设备管理权限
                        </el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="accessForm.access" @change="handleCheckedCitiesChange2">
                            <el-checkbox v-for="item in permissionList" :label="item.permissionId"
                                         :key="item.permissionId">{{item.permissionName}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="accessVisible = false">取 消</el-button>
    <el-button type="primary" @click="accessFormSubmit">确 定</el-button>
  </span>
        </el-dialog>

    </div>
</template>

<script>
    import API from '../../api/api'
    import qs from 'qs'
    import pagination from '../../components/common/pagination'

    //角色管理
    export default {
        name: "role",
        components:{
            pagination
        },
        data() {
            return {
                condition: {
                    userName: '',
                    email: '',
                    mobile: '',
                    role: '',
                },//查询条件
                roleList: [],
                dutyList: [],
                usersList: [{}],
                roleSelection: [],
                page: 1,
                pageSize: 10,//每页条数
                total: 0,//总条数

                //对话框部分
                roleForm: {
                    roleName: '',
                    roleStatus: 'active',
                    roleDesc: '',
                },
                rules: {
                    roleName: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                    ],
                },
                isAdd: true,
                dialogVisible: false,

                accessForm: {
                    equipment: [],//设备权限
                    access: [],//操作权限
                },
                accessVisible: false,

                equipmentList: [],//设备列表
                permissionList: [],
                isIndeterminate1: false,
                isIndeterminate2: false,
                checkAll1: false,//全选
                checkAll2: false,//全选
                accessRoleId: '',//记录正在操作的roleId
            }
        },
        methods: {
            //获取角色列表
            getRole(current, size) {
                let params = {}
                this.axios({
                    url: this.$http + API.roleList + (current - 1) * size + '/' + size,
                    method: 'get',
                    params: params
                }).then(res => {
                    this.roleList = JSON.parse(JSON.stringify(res.data.result))
                    this.total = res.data.totalCount
                })

            },
            getPermissionObjectList() {
                // let params = {
                //     status: 'active'
                // }
                this.axios({
                    url: this.$http + API.permissionObjectList + '0/100',
                    method: 'get',
                    // params: qs.stringify(params)
                }).then(res => {
                    this.equipmentList = JSON.parse(JSON.stringify(res.data.result))
                })
            },
            getPermissionList() {
                this.axios({
                    url: this.$http + API.permissionList + '0/100',
                    method: 'get',
                }).then(res => {
                    this.permissionList = JSON.parse(JSON.stringify(res.data.result))
                })
            },
            //表格选择变化
            handleSelectionChange(val) {
                this.roleSelection = val
            },

            //删除
            deleteClick(row) {
                this.$confirm('确定要删除该用户吗?', '危险', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                }).then(() => {
                    this.axios({
                        url: this.$http + API.roleDelete + row.roleId,
                        method: 'get',
                    }).then(res => {
                        if (res.data.status === 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getRole(this.page, this.pageSize);
                        } else {
                            this.$message.error(res.data.statusDesc)
                        }
                    }).catch(err => {
                        if (err.response.status === 500) {
                            this.$message(
                                {
                                    type: "warning",
                                    duration: 3500,
                                    message: '该角色已绑定权限，请解绑后删除！',
                                    offset: 340
                                }
                            );
                        }
                    })
                }).catch(e => e);
            },

            //禁用
            forbiddenClick(row) {
                this.$confirm('确定要禁用该用户吗?', '危险', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '禁用成功!'
                    });
                }).catch(e => e);
            },
            //编辑
            editClick(row) {
                this.roleForm = JSON.parse(JSON.stringify(row))
                this.isAdd = false;
                this.dialogVisible = true;
            },

            //创建编辑对话框关闭
            handleClose() {
                let timeout = setTimeout(() => {
                    this.roleForm = {
                        roleName: '',
                        roleStatus: 'active',
                        roleDesc: '',
                    };
                    this.isAdd = true;
                    clearTimeout(timeout)
                }, 200)

            },
            //划分权限对话框关闭
            accessHandleClose() {
                this.accessForm = {
                    equipment: [],//设备权限
                    access: [],//操作权限
                }
            },
            //创建编辑对话框确定按钮
            roleFormSubmit() {
                this.$refs.roleForm.validate((valid) => {
                    if (valid) {
                        if (this.isAdd) {
                            this.addAjax()
                        } else {
                            this.editAjax()
                        }
                    } else {
                        return false;
                    }
                });
            },

            addAjax() {
                let params = {
                    roleName: this.roleForm.roleName
                }
                if (this.roleForm.roleDesc !== '') {
                    params.roleDesc = this.roleForm.roleDesc
                }
                this.axios({
                    url: this.$http + API.roleAdd,
                    method: 'post',
                    data: params
                }).then(res => {
                    //res.data.returnId//角色Id
                    if (res.data.status === 0) {
                        this.dialogVisible = false;
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                        this.getRole(this.page, this.pageSize);
                    } else {
                        this.$message.error(res.data.statusDesc);
                    }
                })
            },

            editAjax() {
                let params = {
                    roleId: this.roleForm.roleId,
                    roleName: this.roleForm.roleName,
                    roleDesc: this.roleForm.roleDesc
                };

                this.axios({
                    url: this.$http + API.roleEdit,
                    method: 'post',
                    data: params
                }).then(res => {
                    //res.data.returnId//角色Id
                    if (res.data.status === 0) {
                        this.dialogVisible = false;
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                        this.getRole(this.page, this.pageSize);
                    } else {
                        this.$message.error(res.data.statusDesc);
                    }
                })
            },

            //授权
            accreditClick(row) {
                this.accessRoleId = row.roleId;
                this.axios({
                    url: this.$http + API.rolePermissionListViByRoleId + '0/100',
                    method: 'get',
                    params: {
                        roleId: row.roleId
                    }
                }).then(res => {
                    if (res.data.status === 0) {
                        this.accessForm.access = res.data.supplement;
                        this.accessForm.equipment = res.data.result;
                        this.handleCheckedCitiesChange1(res.data.result);
                        this.handleCheckedCitiesChange2(res.data.supplement);
                        this.accessVisible = true;
                    } else {
                        this.$message.error(res.data.statusDesc)
                    }
                })
            },
            //划分权限确定按钮
            accessFormSubmit() {
                // let params = {
                //     permissionObjectIds: '["' + this.accessForm.equipment.join('","') + '"]',
                //     permissionIds: '["' + this.accessForm.access.join('","') + '"]',
                // }
                let params = {
                    permissionObjectIds: this.accessForm.equipment,
                    permissionIds: this.accessForm.access,
                };
                this.axios({
                    url: this.$http + API.rolePermissionSetByList + this.accessRoleId,
                    method: 'post',
                    data: params
                }).then(res => {
                    if (res.data.status === 0) {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.accessVisible = false;
                        this.getRole(this.page, this.pageSize);
                    } else {
                        this.$message.error(res.data.statusDesc)
                    }
                })
            },

            //划分权限全选 change事件
            handleCheckAllChange1(val) {
                this.accessForm.equipment = [];
                if (val) {
                    this.equipmentList.forEach(item =>{
                        this.accessForm.equipment.push(item.permissionObjectId)
                    })
                }
            },
            handleCheckAllChange2(val) {
                this.accessForm.access = [];
                if (val) {
                    this.permissionList.forEach(item =>{
                        this.accessForm.access.push(item.permissionId);
                    });
                }
            },
            //划分权限全选 change事件
            handleCheckedCitiesChange1(val) {
                if (val.length === 0) {
                    this.checkAll1 = false;
                    this.isIndeterminate1 = false;
                } else if (val.length === this.equipmentList.length) {
                    this.checkAll1 = true;
                    this.isIndeterminate1 = false;
                } else {
                    this.checkAll1 = true;
                    this.isIndeterminate1 = true;
                }
            },
            handleCheckedCitiesChange2(val) {
                if (val.length === 0) {
                    this.checkAll2 = false;
                    this.isIndeterminate2 = false;
                } else if (val.length === this.permissionList.length) {
                    this.checkAll2 = true;
                    this.isIndeterminate2 = false;
                } else {
                    this.checkAll2 = true;
                    this.isIndeterminate2 = true;
                }
            },

            //点击查询按钮
            queryBtn(){
                this.$refs.pagination.reset();
            },
            //分页变化
            paginationChange(res){
                this.page = res.page;
                this.pageSize = res.pageSize;
                this.getRole(this.page, this.pageSize);
            },
        },
        mounted() {
            this.getRole(this.page, this.pageSize);
            this.getPermissionList();
            this.getPermissionObjectList();
        },
    }
</script>

<style lang="scss" scoped>
    #role {
        position: relative;

        .el-input {
            width: 218px;
        }
    }

    .btns {
        height: 45px;
        line-height: 45px;
        background-color: #f9f9f9;
        padding: 0 20px;

        .el-button {
            margin: 0 20px;
        }
    }

    .table {
        margin-top: 20px;
        height: calc(100% - 110px);

        .operation {
            display: flex;
            justify-content: space-around;
        }
    }

    .page {
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
    }

    .roleForm {
        > div {
            width: 460px;
        }

        .el-form-item {
            margin-right: 0;
        }

        .el-textarea {
            width: 350px;
        }

    }

    .accessDialog {
        display: flex;
        justify-content: space-between;

        > div {
            width: 50%;
            padding-bottom: 30px;
        }

        > div:first-child {
            border-right: 1px solid #eeeeee;

            .el-checkbox {
                display: block;
            }
        }
        > div:last-child {
          padding-left: 30px;
        }

        > div:last-child {
            width: 330px;

            > div:last-child {
                margin-top: 15px;
            }
        }

        .el-checkbox-group {
            margin-left: 25px;
        }

    }
</style>

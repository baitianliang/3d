<template>
    <div id="users">
        <div class="search">
            <el-form :inline="true" label-position="left" :model="condition" label-width="0.36rem">
                <div>
                    <el-form-item label="用户名">
                        <el-input v-model="condition.userName" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <!--                    <el-form-item label="邮箱">-->
                    <!--                        <el-input v-model="condition.email" placeholder="请输入邮箱"></el-input>-->
                    <!--                    </el-form-item>-->
                    <!--                    <el-form-item label="手机">-->
                    <!--                        <el-input v-model="condition.mobile" placeholder="请输入手机号"></el-input>-->
                    <!--                    </el-form-item>-->
                </div>
                <div>
                    <!--                    <el-form-item label="所属角色">-->
                    <!--                        <el-select v-model="condition.role" placeholder="请选择角色">-->
                    <!--                            <el-option-->
                    <!--                                    v-for="item in roleList"-->
                    <!--                                    :key="item.value"-->
                    <!--                                    :label="item.label"-->
                    <!--                                    :value="item.value">-->
                    <!--                            </el-option>-->
                    <!--                        </el-select>-->
                    <!--                    </el-form-item>-->
                    <!--                    <el-form-item label="从事职务">-->
                    <!--                        <el-select v-model="condition.roleId" placeholder="请选择职务">-->
                    <!--                            <el-option-->
                    <!--                                    v-for="item in roleList"-->
                    <!--                                    :key="item.roleId"-->
                    <!--                                    :label="item.roleName"-->
                    <!--                                    :value="item.roleId">-->
                    <!--                            </el-option>-->
                    <!--                        </el-select>-->
                    <!--                    </el-form-item>-->
                    <el-form-item label="用户状态">
                        <el-select v-model="condition.userStatus" placeholder="请选择职务">
                            <el-option label="全部" value="-delete"></el-option>
                            <el-option label="启用" value="active"></el-option>
                            <el-option label="禁用" value="inactive"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="queryBtn" style="margin-left: 0.1rem">查询</el-button>
                    </el-form-item>

                </div>
            </el-form>
        </div>
        <div class="btns">
            <el-button round size="mini" @click="dialogVisible = true">添加</el-button>
            <!--            <el-button type="danger" plain round size="mini">删除</el-button>-->
            <el-button round type="primary" size="mini" class="recycle" @click="recycleClick">回收站</el-button>
        </div>
        <div class="table">
            <el-table
                    ref="multipleTable"
                    :data="usersList"
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
                        prop="userName"
                        label="用户名"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="userTrueName"
                        label="姓名"
                        width="150">
                </el-table-column>
                <el-table-column
                        label="性别"
                        width="80">
                    <template slot-scope="scope">
                        {{scope.row.userSex !== null ? `${scope.row.userSex === 1? '男':'女'}`:''}}
                    </template>
                </el-table-column>
                <!--                <el-table-column-->
                <!--                        prop="roleName"-->
                <!--                        label="所属角色"-->
                <!--                        width="200">-->
                <!--                </el-table-column>-->
                <el-table-column
                        prop="userJob"
                        label="从事职务"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="userBirthday"
                        label="出生日期"
                        width="150">
                    <!--                    <template slot-scope="scope">-->
                    <!--                        {{scope.row.userBirthday}}-->
                    <!--                    </template>-->
                </el-table-column>
                <el-table-column
                        prop="userEmail"
                        label="邮箱"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="userMobileId"
                        label="手机"
                        width="150">
                </el-table-column>
                <el-table-column
                        label="操作"
                        min-width="200"
                >
                    <template slot-scope="scope">
                        <div class="operation">
                            <el-button type="text" icon="el-icon-delete" :disabled="scope.row.userStatus === 'delete'"
                                       @click="deleteClick(scope.row)">删除
                            </el-button>
                            <el-button type="text" icon="el-icon-edit-outline" @click="forbiddenClick(scope.row)"
                                       v-if="scope.row.userStatus === 'inactive'">启用
                            </el-button>
                            <el-button type="text" icon="el-icon-edit-outline" @click="forbiddenClick(scope.row)"
                                       v-if="scope.row.userStatus === 'active'">禁用
                            </el-button>
                            <!--                            <el-button type="text" icon="el-icon-edit-outline" @click="forbiddenClick(scope.row)">{{scope.row.userStatus === 'active' ? '禁用':'启用'}}</el-button>-->
                            <el-button type="text" icon="el-icon-user-solid"
                                       :disabled="scope.row.userStatus === 'delete'" @click="editClick(scope.row)">编辑
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination :total="total" @paginationChange="paginationChange" ref="pagination"></pagination>
        <el-dialog
                :title="isAdd?'创建用户':'编辑用户'"
                :visible.sync="dialogVisible"
                width="3.8rem"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @close="handleClose"
                @open="getVender"
        >
            <el-form class="userForm" :inline="true" ref="userForm" :rules="rules" :model="userForm" label-width="0.46875rem">
                <div>
                    <el-form-item label="用户名" prop="userName">
                        <el-input v-model="userForm.userName" placeholder="请输入姓名" :readonly="!isAdd"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password" v-if="isAdd">
                        <el-input v-model="userForm.password" type="password" show-password
                                  placeholder="请输入密码" :readonly="!isAdd"></el-input>
                    </el-form-item>
                    <el-form-item label=" " v-else >
                        <el-button type="warning" @click="resetPwd">重置密码</el-button>
                    </el-form-item>

                </div>
                <div>
                    <el-form-item label="姓名" prop="userTrueName">
                        <el-input v-model="userForm.userTrueName" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-select v-model="userForm.userSex" placeholder="请选择性别">
                            <el-option label="男" :value="1"></el-option>
                            <el-option label="女" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="出生日期">
                        <el-date-picker
                                v-model="userForm.userBirthday"
                                type="date"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                placeholder="选择出生日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="职位">
                        <el-input v-model="userForm.userJob" placeholder="请输入职位名称"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="手机" prop="userMobileId">
                        <el-input type="tel" v-model="userForm.userMobileId" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="userEmail">
                        <el-input v-model="userForm.userEmail" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="角色">
                        <el-select v-model="userForm.roleId" multiple clearable placeholder="请选择角色">
                            <el-option
                                    v-for="item in roleList"
                                    :key="item.roleId"
                                    :label="item.roleName"
                                    :value="item.roleId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="部门">
                        <el-select v-model="userForm.userVenderId" clearable placeholder="请选择部门" :disabled="!isAdd">
                            <el-option
                                    v-for="item in venderList"
                                    :key="item.venderId"
                                    :label="item.venderName"
                                    :value="item.venderId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="状态">
                        <el-radio-group v-model="userForm.userStatus">
                            <el-radio label="active">启用</el-radio>
                            <el-radio label="inactive">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="备注" style="width: 100%">
                        <el-input type="textarea" :autosize="{minRows:3,maxRows:6}" resize="none"
                                  v-model="userForm.userRemark" placeholder="请输入备注"></el-input>
                    </el-form-item>

                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="userFormSubmit">确 定</el-button>
  </span>
        </el-dialog>
        <el-dialog title="回收站" :visible.sync="deleteDialog" width="650px">
            <el-table :data="deleteUserList">
                <el-table-column
                        prop="userName"
                        label="用户名"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="userTrueName"
                        label="姓名"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="userJob"
                        label="从事职务"
                        width="150">
                </el-table-column>
                <el-table-column
                        label="操作"
                        min-width="100"
                >
                    <template slot-scope="scope">
                        <div class="operation">
                            <el-button type="text" icon="el-icon-edit-outline" @click="forbiddenClick(scope.row)">恢复
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import API from '../../api/api'
    import pagination from '../../components/common/pagination'
    import qs from 'qs'

    export default {
        name: "users",
        components:{
            pagination
        },
        data() {
            var checkPhone = (rule, value, callback) => {
                if (value) {
                    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
                    if (reg.test(value)) {
                        callback();
                    } else {
                        return callback(new Error('请输入正确的手机号'));
                    }
                }else{
                    callback();
                }
            }
            return {
                condition: {
                    userName: '',
                    email: '',
                    mobile: '',
                    roleId: '',
                    userStatus: '-delete',
                },
                roleList: [],
                usersList: [],
                venderList: [],
                userSelection: [],
                page: 1,
                pageSize: 10,//每页条数
                total: 0,//总条数

                //对话框部分
                userForm: {
                    userName: '',
                    password: '',
                    userTrueName: '',
                    userMobileId: '',
                    roleId: [],
                    userBirthday: '',
                    userJob: '',
                    userRemark: '',
                    userEmail: '',
                    userIdCard: '',
                    userSex: '',
                    userVenderId: '',
                    userStatus: 'active',
                },
                passwordBF: '',
                rules: {
                    userName: [
                        {required: true, message: '请输入用户账号', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入用户密码', trigger: 'blur'},
                    ],
                    userTrueName: [
                        {required: true, message: '请输入真实姓名', trigger: 'blur'},
                    ],
                    userMobileId: [
                        {validator: checkPhone, trigger: ['blur', 'change']},
                    ],
                    userEmail: [
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                    ],
                },
                isAdd: true,
                dialogVisible: false,

                deleteDialog: false,
                deleteUserList: [],
            }
        },
        methods: {
            //获取用户列表
            getUser(current, size) {
                let params = {};
                if (this.condition.userName !== '') {
                    params.userName = this.condition.userName
                }
                if (this.condition.userStatus !== '') {
                    params.userStatus = this.condition.userStatus
                }
                this.axios({
                    url: this.$http + API.userList + (current - 1) * size + '/' + size,
                    method: 'get',
                    params: params
                }).then(res => {
                    this.usersList = JSON.parse(JSON.stringify(res.data.result));
                    this.usersList.forEach(data => {
                        if (data.userBirthday !== null) {
                            data.userBirthday = data.userBirthday.substr(0, 10)
                        }
                    })
                    this.total = res.data.totalCount
                })
            },
            //获取角色列表
            getRole() {
                this.axios({
                    url: this.$http + API.roleList + '0/100',
                    method: 'get',
                }).then(res => {
                    this.roleList = JSON.parse(JSON.stringify(res.data.result))
                })
            },
            //获取部门列表
            getVender() {
                this.axios({
                    url: this.$http + API.venderList + '0/100',
                    method: 'get',
                    params: {
                        status: 'active'
                    }
                }).then(res => {
                    this.venderList = JSON.parse(JSON.stringify(res.data.result));
                })
            },
            //获取回收站内用户
            getDeleteUser(){
                let params = {
                    userStatus : 'delete'
                };
                this.axios({
                    url: this.$http + API.userList + '0/100',
                    method: 'get',
                    params: params
                }).then(res => {
                    this.deleteUserList = JSON.parse(JSON.stringify(res.data.result));
                    this.deleteUserList.forEach(data => {
                        if (data.userBirthday !== null) {
                            data.userBirthday = data.userBirthday.substr(0, 10)
                        }
                    });
                })
            },
            //表格选择变化
            handleSelectionChange(val) {
                this.userSelection = val
            },
            //回收站
            recycleClick(){
                this.getDeleteUser();
                this.deleteDialog = true;
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
                        url: this.$http + API.userDelete + row.userId,
                        method: 'get',
                    }).then(res => {
                        if (res.data.status === 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getUser(this.page, this.pageSize);
                        } else {
                            this.$message.error(res.data.statusDesc)
                        }
                    })
                }).catch(e => e)
            },
            //禁用/启用/恢复
            forbiddenClick(row) {
                if (row.userStatus === 'delete') {
                    let params = {
                        userId: row.userId,
                        userStatus: 'active'
                    };
                    this.axios({
                        url: this.$http + API.userEdit,
                        method: 'post',
                        data: params
                    }).then(res => {
                        if (res.data.status === 0) {
                            this.$message({
                                type: 'success',
                                message: '恢复成功'
                            });
                            this.getDeleteUser();
                            this.getUser(this.page, this.pageSize);
                        } else {
                            this.$message.error(res.data.statusDesc);
                        }
                    })
                } else {
                    this.$confirm(`确定要${row.userStatus === 'active' ? '禁用' : '启用'}该用户吗?`, `${row.userStatus === 'active' ? '危险' : '提示'}`, {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        closeOnClickModal: false,
                        closeOnPressEscape: false,
                    }).then(() => {
                        let params = {
                            userId: row.userId,
                        };
                        if (row.userStatus === 'active') {
                            params.userStatus = 'inactive'
                        } else if (row.userStatus === 'inactive') {
                            params.userStatus = 'active'
                        }
                        this.axios({
                            url: this.$http + API.userEdit,
                            method: 'post',
                            data: params
                        }).then(res => {
                            if (res.data.status === 0) {
                                if (row.userStatus === 'active') {
                                    row.userStatus = 'inactive'
                                } else if (row.userStatus === 'inactive') {
                                    row.userStatus = 'active'
                                }
                                this.$message({
                                    type: 'success',
                                    message: '操作成功'
                                });
                            } else {
                                this.$message.error(res.data.statusDesc);
                            }
                        })
                    }).catch(e => e)
                }
            },
            //编辑
            editClick(row) {
                row.roleId = []
                this.userForm = JSON.parse(JSON.stringify(row))
                this.passwordBF = this.userForm.password
                this.isAdd = false;
                this.axios({
                    url: this.$http + API.userRoleList + '0/100',
                    method: 'get',
                    params: {
                        userId: row.userId
                    }
                }).then(res => {
                    res.data.result.forEach(data => {
                        this.userForm.roleId.push(data.roleId)
                    })
                })
                this.dialogVisible = true;
            },
            //重置密码
            resetPwd() {
                let params = {
                    userId: this.userForm.userId,
                    newPwd: 111111
                };
                this.axios({
                    url: this.$http + API.userUpdatePwd,
                    method: 'post',
                    data: qs.stringify(params)
                }).then(res => {
                    if (res.data.status === 0) {
                        this.$message({
                            type: 'success',
                            message: '重置成功!'
                        });
                    } else {
                        this.$message.error(res.data.statusDesc)
                    }
                })
            },
            //对话框关闭
            handleClose() {
                this.userForm = {
                    userName: '',
                    password: '',
                    userTrueName: '',
                    userMobileId: '',
                    roleId: [],
                    userBirthday: '',
                    userJob: '',
                    userRemark: '',
                    userEmail: '',
                    userIdCard: '',
                    userSex: '',
                    userVenderId: '',
                    userStatus: 'active',
                };
                this.isAdd = true;
                this.$refs.userForm.clearValidate();
            },
            //对话框确定按钮
            userFormSubmit() {
                this.$refs.userForm.validate((valid) => {
                    if (valid) {
                        if (this.isAdd) {
                            this.addAjax()
                        } else {
                            this.editAjax()
                        }
                    } else {
                        return false;
                    }
                })
            },
            //添加ajax
            addAjax() {
                // console.log(this.userForm)
                let params = {};
                for ( let i in this.userForm) {
                    if (this.userForm[i] !=='' && typeof this.userForm[i] !== "object"){
                        if (i === 'userBirthday') {
                            params[i] = this.userForm[i] + ' 00:00:00';
                        }else{
                            params[i] = this.userForm[i]
                        }
                    }else if(typeof this.userForm[i] === "object" && this.userForm[i].length > 0){
                        params[i] = this.userForm[i]
                    }
                }
                this.axios({
                    url: this.$http + API.userAdd,
                    method: 'post',
                    data: params
                }).then(res => {
                    if (res.data.status === 0) {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.userRoleSet(res.data.returnId)
                    } else {
                        this.$message.error(res.data.statusDesc);
                    }
                })

            },
            //编辑ajax
            editAjax() {
                let params = {
                    userId: this.userForm.userId,
                    userStatus: this.userForm.status,
                    userTrueName: this.userForm.userTrueName,
                    userMobileId: this.userForm.userMobileId,
                    userJob: this.userForm.userJob,
                    userRemark: this.userForm.userRemark,
                    userEmail: this.userForm.userEmail,
                    userIdCard: this.userForm.userIdCard,
                    userSex: this.userForm.userSex,
                };
                // if (this.userForm.userVenderId !== '') {
                //     params.userVenderId = this.userForm.userVenderId
                // }
                if (this.userForm.userBirthday !== null && this.userForm.userBirthday !== '') {
                    params.userBirthday = this.userForm.userBirthday + ' 00:00:00'
                }
                this.axios({
                    url: this.$http + API.userEdit,
                    method: 'post',
                    data: params
                }).then(res => {
                    if (res.data.status === 0) {
                        this.$message({
                            type: 'success',
                            message: '修改用户信息操作成功!'
                        });
                        this.userRoleSet(this.userForm.userId);
                    } else {
                        this.$message.error(res.data.statusDesc);
                    }
                })
            },
            //更新绑定
            userRoleSet(userId) {
                let params = {
                    roleIds: this.userForm.roleId
                }
                this.axios({
                    url: this.$http + API.userRoleSetByList + userId,
                    method: 'post',
                    data: params
                }).then(res => {
                    if (res.data.status === 0) {
                        this.$message({
                            type: 'success',
                            message: '分配角色成功!'
                        });
                        this.dialogVisible = false;
                        this.getUser(this.page, this.pageSize);
                    } else {
                        // this.$message.error(res.data.statusDesc)
                        this.$message.error('分配角色失败')
                    }
                })
            },

            //点击查询按钮
            queryBtn(){
                this.$refs.pagination.reset();
            },
            //分页变化
            paginationChange(res){
                this.page = res.page;
                this.pageSize = res.pageSize;
                this.getUser(this.page, this.pageSize);
            },
        },
        mounted() {
            this.getUser(this.page, this.pageSize);
            this.getRole();
            this.getVender();
        }
    }
</script>

<style lang="scss" scoped>
    #users {
        position: relative;

        .el-input {
            width: 216px;
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
        height: calc(100% - 230px);

        .operation {
            display: flex;
            justify-content: space-around;
            align-items: center;

            span {
                color: #eeeeee;
            }
        }
    }

    .userForm {
        width: 3.5rem;
        margin: auto;
        > div {
            /*width: 670px;*/
        }

        .el-form-item {
            margin-right: 0;
        }

        .el-form-item + .el-form-item {
            margin-left: 10px;
        }

        .el-textarea {
            width: 515px;
        }

    }

    .recycle {
        border-color: #f37a31;
        background-color: #f37a31;
    }

    .recycle:hover {
        border-color: #f37a31;
    }
    .el-select{
        width: 216px;
    }
</style>

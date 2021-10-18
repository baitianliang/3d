<template>
    <div id="tableWrapper">
        <div class="search">
            <div>
                <span>姓名：</span>
                <el-input v-model="condition.trueName" placeholder="请输入姓名"></el-input>
            </div>
            <div>
                <span>手机：</span>
                <el-input v-model="condition.mobile" placeholder="请输入手机号"></el-input>
            </div>
            <div>
                <el-button @click="queryBtn">查询</el-button>
            </div>
        </div>
        <div class="btns">
            <el-button round size="mini" @click="addUserDialog = true">添加</el-button>
            <!--            <el-button type="danger" plain round size="mini">批量删除</el-button>-->
        </div>
        <div class="table">
            <el-table
                    ref="multipleTable"
                    :data="personnelList"
                    height="100%"
                    tooltip-effect="dark"
                    style="width: 100%"
                    :header-cell-style="{textAlign:'center',backgroundColor:'#F6F6F6'}"
                    :cell-style="{textAlign:'center'}"
                    @selection-change="handleSelectionChange">
                <!--                <el-table-column-->
                <!--                        type="selection"-->
                <!--                        min-width="50">-->
                <!--                </el-table-column>-->
                <el-table-column
                        label="序号"
                        type="index"
                        width="100">
                </el-table-column>
                <!--                <el-table-column-->
                <!--                        label="头像"-->
                <!--                        width="80">-->
                <!--                    <template slot-scope="scope">-->
                <!--                        <el-avatar :size="40">{{scope.row.userTrueName.substr(0,1)}}</el-avatar>-->
                <!--                    </template>-->
                <!--                </el-table-column>-->
                <el-table-column
                        prop="userName"
                        label="账户"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="userTrueName"
                        label="姓名"
                        width="120">
                </el-table-column>
                <el-table-column
                        label="性别"
                        min-width="50">
                    <template slot-scope="scope">
                        {{scope.row.userSex !== null ? `${scope.row.userSex === 1? '男':'女'}`:''}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="userJob"
                        label="从事职务"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="userEmail"
                        label="邮箱"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="userMobileId"
                        label="手机"
                        width="120">
                </el-table-column>
                <el-table-column
                        label="操作"
                        min-width="200">
                    <template slot-scope="scope">
                        <div class="operation">
                            <el-button type="text" icon="el-icon-delete" @click="deleteClick(scope.row)">删除</el-button>
                            <el-button type="text" icon="el-icon-edit-outline" @click="editClick(scope.row)">编辑
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination :total="total" @paginationChange="paginationChange" ref="pagination"></pagination>

        <!--        部门编辑人员-->
        <el-dialog
                title="编辑用户"
                :visible.sync="dialogVisible"
                width="620px"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @close="handleClose"
                @open="getRole"
        >
            <div class="editUserForm">
                <el-form :inline="true" ref="userForm" :rules="rules" :model="userForm" label-width="70px">
                    <div>
                        <el-form-item label="用户名" prop="userName">
                            <el-input v-model="userForm.userName" placeholder="请输入姓名" :readonly="true"></el-input>
                        </el-form-item>
                        <el-button type="warning" style="margin-left: 0.416rem" @click="resetPwd">重置密码</el-button>
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
                        <el-form-item label="状态">
                            <el-radio-group v-model="userForm.userStatus">
                                <el-radio label="active">启用</el-radio>
                                <el-radio label="inactive">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="备注">
                            <el-input type="textarea" :autosize="{minRows:3,maxRows:6}" resize="none"
                                      v-model="userForm.userRemark" placeholder="请输入备注"></el-input>
                        </el-form-item>

                    </div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="userFormSubmit">确 定</el-button>
  </span>
        </el-dialog>
        <!--        部门添加人员-->
        <el-dialog
                title="添加人员"
                :visible.sync="addUserDialog"
                width="620px"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @open="getUnVenderUser()"
                @close="trueName = ''"
        >
            <div class="venderAddUser">
                <div>
                    <el-input v-model="trueName" placeholder="请输入姓名" @keyup.enter="getUnVenderUser" @input="getUnVenderUser"></el-input>
                    <el-button @click="getUnVenderUser">确定</el-button>
                </div>
                <div>
                    <el-button type="primary" v-for="item in unVenderUserList" :key="item.userId" v-if="item.userName !== 'root'">
                        {{item.userTrueName}}<i class="el-icon-circle-plus" @click="venderAddUser(item)"></i>
                    </el-button>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addUserDialog = false">关 闭</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import API from "../../api/api";
    import qs from 'qs'
    import pagination from '../common/pagination'

    export default {
        name: "yeya",
        props: {
            dept: {
                type: String
            }
        },
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
                    trueName: '',
                    mobile: '',
                },
                personnelList: [],
                multipleSelection: [],//选中的表格数据
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
                unVenderUserList: [],//未分配用户

                dialogVisible: false,//编辑用户对话框
                roleList: [],//角色列表
                addUserDialog: false,//添加人员对话框
                trueName: '',
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
                },//表单验证
                page: 1,
                pageSize: 10,//每页条数
                total: 0,//总条数
            }
        },
        methods: {
            //获取用户列表
            getUser(current, size) {
                let params = {
                    userStatus: 'active',
                    venderId: this.dept,
                };
                this.axios({
                    url: this.$http + API.userList + (current - 1) * size + '/' + size,
                    method: 'get',
                    params: params
                }).then(res => {
                    this.personnelList = JSON.parse(JSON.stringify(res.data.result))
                    this.total = res.data.totalCount
                })
            },
            //获取未分配用户列表
            getUnVenderUser() {
                let params = {
                    userStatus: 'active',
                    venderId: '-',
                };
                if (this.trueName !== ''){
                    params.trueName = this.trueName
                }
                this.axios({
                    url: this.$http + API.userList + '0/100',
                    method: 'get',
                    params: params
                }).then(res => {
                    this.unVenderUserList = JSON.parse(JSON.stringify(res.data.result))
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
            venderAddUser(row){
                let params = {
                    userId: row.userId,
                    userVenderId: this.dept,
                };
                this.axios({
                    url: this.$http + API.userEdit,
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: params
                }).then(res => {
                    if (res.data.status === 0) {
                       this.getUnVenderUser();
                        this.getUser(this.page, this.pageSize)
                    } else {
                        this.$message.error(res.data.statusDesc);
                    }
                })
            },
            //表格多选变化
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            // 删除
            deleteClick(row) {
                this.$confirm('此操作将从部门移除该人员！', '危险', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                }).then(() => {
                    this.axios({
                        url: this.$http + API.userClearVender + row.userId,
                        method: 'get',
                    }).then(res => {
                        if (res.data.status === 0) {
                            this.getUser(this.page, this.pageSize)
                            this.$message({
                                type: 'success',
                                message: '移除成功!'
                            });
                        } else {
                            this.$message.error(res.data.statusDesc);
                        }
                    })
                }).catch(e =>e)
            },

            //编辑
            editClick(row) {
                row.roleId = []
                this.userForm = JSON.parse(JSON.stringify(row));
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
                this.$refs.userForm.clearValidate();
            },

            //对话框确认按钮
            userFormSubmit() {
                let params = {
                    userId: this.userForm.userId,
                    userStatus: this.userForm.status,
                    userVenderId: this.userForm.userVenderId,
                    userTrueName: this.userForm.userTrueName,
                    userMobileId: this.userForm.userMobileId,
                    userBirthday: this.userForm.userBirthday + ' 00:00:00',
                    userJob: this.userForm.userJob,
                    userRemark: this.userForm.userRemark,
                    userEmail: this.userForm.userEmail,
                    userIdCard: this.userForm.userIdCard,
                    userSex: this.userForm.userSex,
                };
                if (this.userForm.password !== this.passwordBF) {
                    params.password = this.userForm.password
                }
                this.axios({
                    url: this.$http + API.userEdit,
                    method: 'post',
                    data: qs.stringify(params)
                }).then(res => {
                    if (res.data.status === 0) {
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
                };
                this.axios({
                    url: this.$http + API.userRoleSetByList + userId,
                    method: 'post',
                    data: params
                }).then(res => {
                    if (res.data.status === 0) {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.dialogVisible = false;
                        this.getUser(this.page, this.pageSize);
                    } else {
                        this.$message.error(res.data.statusDesc)
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
        },
        watch: {
            dept(newVal, oldVal) {
                this.getUser(this.page, this.pageSize)
            }
        },
    }
</script>

<style lang="scss" scoped>
    #tableWrapper {
        width: calc(100% - 280px);
        height: 100%;
        padding: 20px 30px;
        position: relative;

        > div {
            margin-top: 20px;
        }

        > div:first-child {
            margin-top: 0;
        }
        .el-input {
            width: 216px;
        }
    }

    .search {
        display: flex;

        > div {
            display: flex;
            line-height: 40px;
            margin-right: 30px;

            span {
                width: 70px;
                font-size: 18px;
                color: #bfbfbf;
            }
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
        height: calc(100% - 180px);

        .operation {
            display: flex;
            justify-content: space-around;
        }
    }

    .page {
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
        margin: 0 !important;
    }

    .venderAddUser{
        >div:first-child .el-input{
            width: 250px;
            margin-right: 15px;
        }
        >div:last-child{
            margin-top: 20px;
            .el-button{
                padding-left: 10px;
                padding-right: 10px;
                i{
                    margin-left: 10px;
                }
            }
        }
    }

    .editUserForm {
        .el-form{
            > div {
                width: 590px;
            }

            .el-form-item {
                margin-right: 0;
            }

            .el-form-item + .el-form-item {
                margin-left: 10px;
            }

            .el-textarea {
                width: 505px;
            }
        }


    }
</style>

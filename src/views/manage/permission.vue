<template>
    <div id="permission">
        <div class="btns">
            <el-button round size="mini" @click="dialogVisible = true">创建</el-button>
            <el-button type="danger" plain round size="mini">删除</el-button>
        </div>
        <div class="table">
            <el-table
                    ref="multipleTable"
                    :data="permissionList"
                    height="100%"
                    tooltip-effect="dark"
                    style="width: 100%"
                    :header-cell-style="{textAlign:'center',backgroundColor:'#F6F6F6'}"
                    :cell-style="{textAlign:'center'}"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        label="选项"
                        type="selection"
                        width="100">
                </el-table-column>
                <el-table-column
                        label="序号"
                        type="index"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="permissionName"
                        label="权限名称"
                        width="400">
                </el-table-column>
                <!--                <el-table-column-->
                <!--                        label="状态"-->
                <!--                        width="200">-->
                <!--                </el-table-column>-->
                <el-table-column
                        prop="permissionDesc"
                        label="备注">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="200"
                >
                    <template slot-scope="scope">
                        <div class="operation">
                            <el-button type="text" icon="el-icon-delete" @click="deleteClick(scope.row)">删除</el-button>
                            <el-button type="text" icon="el-icon-user-solid" @click="editClick(scope.row)">编辑
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination :total="total" @paginationChange="paginationChange" ref="pagination"></pagination>

        <el-dialog
                :title="isAdd?'添加权限':'编辑权限'"
                :visible.sync="dialogVisible"
                width="2.6rem"
                :modal="false"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @close="handleClose">

            <el-form class="permissionForm" :inline="true" ref="permissionForm" :rules="rules" :model="permissionForm" label-width="0.46875rem">
                <el-form-item label="权限名称" prop="permissionName">
                    <el-input v-model="permissionForm.permissionName" placeholder="请输入权限名称"></el-input>
                </el-form-item>
                <el-form-item label="唯一标识" prop="permissionValue">
                    <el-input v-model="permissionForm.permissionValue" placeholder="英文唯一标识" @input="accountInput"></el-input>
                </el-form-item>
                <!--                <el-form-item label="状态">-->
                <!--                    <el-radio-group v-model="permissionForm.roleStatus">-->
                <!--                        <el-radio label="active">启用</el-radio>-->
                <!--                        <el-radio label="inactive">禁用</el-radio>-->
                <!--                    </el-radio-group>-->
                <!--                </el-form-item>-->
                <el-form-item label="备注">
                    <el-input type="textarea" :autosize="{minRows:3,maxRows:6}" resize="none"
                              v-model="permissionForm.permissionDesc" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="permissionFormSubmit">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import API from "../../api/api";
    import qs from "qs";
    import pagination from '../../components/common/pagination'

    export default {
        name: "permission",
        components:{
            pagination
        },
        data() {
            return {
                isAdd: true,
                dialogVisible: false,
                permissionList: [],
                permissionSelection: [],
                permissionForm: {
                    permissionName: '',
                    permissionValue: '',
                    permissionDesc: '',
                },
                rules: {
                    permissionName: [
                        {required: true, message: '请输入权限名称', trigger: 'blur'},
                    ],
                    permissionValue: [
                        {required: true, message: '请输入权限英文唯一标识', trigger: 'blur'},
                    ],
                },

                page: 1,
                pageSize: 10,//每页条数
                total: 0,//总条数
            }
        },
        methods: {
            getPermission(current, size) {
                let params = {};
                this.axios({
                    url: this.$http + API.permissionList + (current - 1) * size + '/' + size,
                    method: 'get',
                    params: params
                }).then(res => {
                    this.permissionList = JSON.parse(JSON.stringify(res.data.result))
                    this.total = res.data.totalCount
                })
            },
            //表格选择变化
            handleSelectionChange(val) {
                this.permissionSelection = val
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
                        url: this.$http + API.permissionDelete + row.permissionId,
                        method: 'get',
                    }).then(res => {
                        if (res.data.status === 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getPermission(this.page, this.pageSize)
                        } else {
                            this.$message.error(res.data.statusDesc)
                        }
                    })
                }).catch(e => e);
            },
            //编辑
            editClick(row) {
                this.permissionForm = JSON.parse(JSON.stringify(row))
                this.isAdd = false;
                this.dialogVisible = true;
            },

            //添加/编辑对话框确定按钮
            permissionFormSubmit() {
                this.$refs.permissionForm.validate((valid) => {
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
                    permissionName: this.permissionForm.permissionName,
                    permissionValue: this.permissionForm.permissionValue,
                }
                if (this.permissionForm.permissionDesc !== '') {
                    params.permissionDesc = this.permissionForm.permissionDesc
                }
                this.axios({
                    url: this.$http + API.permissionAdd,
                    method: 'post',
                    data: params
                }).then(res => {
                    console.log(res.data)
                    if (res.data.status === 0) {
                        this.dialogVisible = false;
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                        this.getPermission(this.page, this.pageSize);
                    } else {
                        this.$message.error(res.data.statusDesc);
                    }
                })
            },

            editAjax() {
                let params = {
                    permissionId: this.permissionForm.permissionId,
                    permissionName: this.permissionForm.permissionName,
                    permissionValue: this.permissionForm.permissionValue,
                    permissionDesc: this.permissionForm.permissionDesc
                };
                this.axios({
                    url: this.$http + API.permissionEdit,
                    method: 'post',
                    data: params
                }).then(res => {
                    if (res.data.status === 0) {
                        this.dialogVisible = false;
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                        this.getPermission(this.page, this.pageSize);
                    } else {
                        this.$message.error(res.data.statusDesc);
                    }
                })
            },

            //创建编辑对话框关闭
            handleClose() {
                this.permissionForm = {
                    permissionName: '',
                    permissionValue: '',
                    permissionDesc: '',
                };
                let timeout = setTimeout(() => {
                    this.isAdd = true;
                    clearTimeout(timeout)
                }, 200)

            },

            //点击查询按钮
            queryBtn(){
                this.$refs.pagination.reset();
            },
            //分页变化
            paginationChange(res){
                this.page = res.page;
                this.pageSize = res.pageSize;
                this.getPermission(this.page, this.pageSize);
            },
            //唯一标识验证 实时输入
            accountInput(val){
                let codeReg = new RegExp("[A-Za-z0-9]+"), //正则 英文+数字；
                    len=val.length,
                    str='';
                for(var i=0;i<len;i++){
                    if(codeReg.test(val[i])){
                        str+=val[i];
                    }
                }
                this.permissionForm.permissionValue = str;
            },
        },
        mounted() {
            this.getPermission(this.page, this.pageSize);
        }

    }
</script>

<style lang="scss" scoped>
    #permission {
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

    .permissionForm {
        .el-form-item {
            margin-right: 0;
        }


        .el-input,.el-textarea {
            width: 350px!important;
        }

    }

    .accessDialog {
        display: flex;
        justify-content: space-between;

        > div {
            padding-bottom: 30px;
        }

        > div:first-child {
            width: 200px;
            border-right: 1px solid #eeeeee;

            .el-checkbox {
                display: block;
            }
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

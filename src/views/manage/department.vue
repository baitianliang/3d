<template>
    <div id="department">
        <div class="Dept">
            <div>
                <el-button icon="el-icon-plus" @click="dialogVisible = true">添加</el-button>
                <el-button icon="el-icon-check" @click="editDept" v-if="isOperation">完成</el-button>
                <el-button icon="el-icon-edit-outline" @click="editDept" v-else>编辑</el-button>
            </div>
            <div class="DeptList">
                <div :class="item.venderId === tab?'is-active':''" v-for=" item in DeptList" :key="item.venderId">
                    <transition name="el-fade-in-linear">
                        <div class="operation" v-if="isOperation">
                            <div class="remove">
                                <i class="el-icon-delete-solid" @click="remove(item.venderId)"></i>
                            </div>
                            <div class="edit">
                                <i class="el-icon-edit-outline" @click="updateDept(item)"></i>
                            </div>
                        </div>

                    </transition>
                    <span @mouseenter="onmouseenter($event)" @mouseleave="onmouseleave($event)"
                          @click="tabsChange(item)">
                        <img src="../../assets/img/branch.png" alt="">{{item.venderName}}
                    </span>
                </div>
            </div>
        </div>
        <v-tableWrapper :dept="tab" v-if="tab !== ''"></v-tableWrapper>
        <div v-else style="font-size: 0.1rem;text-align: center;
line-height: 1.5rem;color: #a2a2a2;width: calc(100% - 1.45833rem)">暂无部门</div>
        <el-dialog
                :title="isAdd?'创建部门':'编辑部门'"
                :visible.sync="dialogVisible"
                width="2.65rem"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @close="handleClose">

            <el-form class="venderForm" :inline="true" ref="venderForm" :rules="rules"  :model="venderForm" label-width="0.42105rem">
                <el-form-item label="部门名称" prop="venderName">
                    <el-input v-model="venderForm.venderName" placeholder="请输入部门名称"></el-input>
                </el-form-item>
                <div>
                    <el-form-item label="状态">
                        <el-radio-group v-model="venderForm.venderStatus">
                            <el-radio label="active">启用</el-radio>
                            <el-radio label="inactive">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <el-form-item label="备注">
                    <el-input type="textarea" :autosize="{minRows:3,maxRows:6}" resize="none"
                              v-model="venderForm.venderDesc" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="venderFormSubmit">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import API from '../../api/api'
    import qs from 'qs'
    import vTableWrapper from '../../components/departments/tableWrapper'

    export default {
        name: "department",
        components: {
            vTableWrapper
        },
        data() {
            return {
                DeptList: [],
                tab: '',
                isOperation: false,

                venderForm: {
                    venderName: '',
                    venderStatus: 'active',
                    venderDesc: '',
                },
                rules: {
                    venderName: [
                        {required: true, message: '请输入部门名称', trigger: 'blur'},
                    ],
                },
                isAdd: true,
                dialogVisible: false,
            }
        },
        methods: {
            getVenter() {
                this.axios({
                    url: this.$http + API.venderList + '0/100',
                    method: 'get',
                    params: {
                        status: 'active'
                    }
                }).then(res => {
                    this.DeptList = JSON.parse(JSON.stringify(res.data.result));

                    if (this.DeptList.length === 0){
                        this.tab = ''
                    }else{
                        this.tab = this.DeptList[0].venderId
                    }

                })
            },

            venderFormSubmit() {
                this.$refs.venderForm.validate((valid) => {
                    if (valid) {
                        if (this.isAdd) {
                            this.addAjax();
                        } else {
                            this.editAjax();
                        }
                    } else {
                        return false;
                    }
                });

            },
            addAjax() {
                let params = {
                    venderName: this.venderForm.venderName,
                    venderStatus: this.venderForm.venderStatus,
                }
                if (this.venderForm.venderDesc !== '') {
                    params.venderDesc = this.venderForm.venderDesc
                }
                this.axios({
                    url: this.$http + API.venderAdd,
                    method: 'post',
                    data: params
                }).then(res => {
                    if (res.data.status === 0) {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.dialogVisible = false;
                        this.getVenter();
                    } else {
                        this.$message.error(res.data.statusDesc)
                    }
                })
            },
            editAjax() {
                let params = {
                    venderId: this.venderForm.venderId,
                    venderName: this.venderForm.venderName,
                    venderStatus: this.venderForm.venderStatus,
                    venderDesc: this.venderForm.venderDesc,
                }

                this.axios({
                    url: this.$http + API.venderEdit,
                    method: 'post',
                    data: params
                }).then(res => {
                    if (res.data.status === 0) {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.dialogVisible = false;
                        this.getVenter();
                    } else {
                        this.$message.error(res.data.statusDesc)
                    }
                })
            },

            updateDept(row) {
                this.venderForm = JSON.parse(JSON.stringify(row));
                this.dialogVisible = true;
                this.isAdd = false;
            },
            editDept() {
                this.isOperation = !this.isOperation;
            },
            handleClose() {
                let timeout = setTimeout(()=>{
                    this.venderForm = {
                        venderName: '',
                        venderStatus: 'active',
                        venderDesc: '',
                    }
                    clearTimeout(timeout)
                },350)

                this.isAdd = true;
            },
            //删除部门
            remove(id) {
                this.$confirm('此操作将永久删除该部门, 是否继续?', '危险', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                }).then(() => {
                    this.axios({
                        url: this.$http + API.venderDelete + id,
                        method: 'get',
                    }).then(res =>{
                        if (res.data.status === 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getVenter();
                        } else {
                            this.$message.error(res.data.statusDesc)
                        }
                    }).catch(err =>{
                        if (err.response.status === 500){
                            this.$message(
                                {
                                    type: "warning",
                                    duration: 3500,
                                    message: '该部门下尚存人员，请清空后删除！',
                                    offset: 340
                                }
                            );
                        }
                    })


                })
            },

            tabsChange(item) {
                // 切换
                this.tab = item.venderId;
            },
            onmouseenter(e) {
                e.currentTarget.parentElement.style.background = '#eeeeee'
            },
            onmouseleave(e) {
                e.currentTarget.parentElement.style.background = ''
            },
        },
        mounted() {
            this.getVenter();
        }
    }
</script>

<style lang="scss" scoped>
    #department {
        width: 100%;
        display: flex;
        padding: 0;
        margin-top: 20px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

        .el-input {
            width: 218px;
        }
    }

    .Dept {
        width: 280px;
        height: 100%;
        box-shadow: 10px 0px 5px -10px #5E5E5E;

        > div:first-child {
            height: 90px;
            line-height: 90px;
            text-align: center;
        }

        .DeptList {
            font-size: 14px;

            :hover {
                background-color: #eeeeee;
                cursor: pointer;
            }

            > div {
                height: 60px;
                line-height: 60px;
                padding-left: 90px;
                padding-right: 30px;
                position: relative;

                img {
                    vertical-align: middle;
                    margin-right: 5px;
                }

                span {
                    cursor: pointer;
                }
            }

            .operation {
                position: absolute;
                left: 40px;
                display: flex;

                > div {
                    cursor: pointer;
                }

                .remove {
                    color: #F56C6C;
                    margin-right: 10px;
                }
                .edit{
                    color: #409EFF;
                }
            }
        }

    }


    #department > div:last-child {
        height: 100%;
    }

    .is-active {
        background-color: #eeeeee;
    }

    .venderForm {
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


</style>

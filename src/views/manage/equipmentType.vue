<template>
    <div id="users">
        <div class="search">
            <el-form :inline="true" label-position="left" :model="condition" label-width="0.36rem">
                <div>
                    <el-form-item label="设备类型">
                        <el-input v-model="condition.dtName" placeholder="请输入设备类型"></el-input>
                    </el-form-item>
                    <el-form-item label="设备类别">
                        <el-select v-model="condition.dcId" clearable placeholder="请选择设备类别">
                            <el-option v-for="(item, index) in dcList" :key="index" :label="item.dcName" :value="item.dcId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="getDtList">查询</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="btns">
            <el-button round size="mini" @click="dialogVisible = true">添加</el-button>
        </div>
        <div class="table">
            <el-table
                ref="multipleTable"
                :data="dtList"
                height="100%"
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{textAlign:'center',backgroundColor:'#F6F6F6'}"
                :cell-style="{textAlign:'center'}">
                <el-table-column
                    prop="dtName"
                    label="设备类型">
                </el-table-column>
                <el-table-column
                    prop="dcName"
                    label="设备类别">
                </el-table-column>
                <el-table-column
                    prop="dtAlias"
                    label="设备别名">
                </el-table-column>
                <el-table-column
                    prop="dtRemark"
                    label="备注">
                </el-table-column>
                <el-table-column
                    label="操作"
                    min-width="250"
                    width="250">
                    <template slot-scope="scope">
                        <div class="operation">
                            <el-button
                                type="text"
                                icon="el-icon-user-solid"
                                :disabled="scope.row.userStatus === 'delete'"
                                @click="editClick(scope.row)">编辑
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog
            :title="isAdd ? '添加设备类型' : '修改设备类型'"
            :visible.sync="dialogVisible"
            width="620px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="handleClose">
            <el-form class="userForm" :inline="true" ref="userForm" :rules="rules" :model="userForm" label-width="100px">
                <el-form-item label="设备类型" prop="dtName">
                    <el-input v-model="userForm.dtName" placeholder="请输入设备类型"></el-input>
                </el-form-item>
                <el-form-item label="设备类别" prop="dcId">
                    <el-select v-model="userForm.dcId" placeholder="请选择设备类别" @change="changeDc">
                        <el-option v-for="(item, index) in dcList" :key="index" :label="item.dcName" :value="item.dcId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备别名" prop="dtAlias">
                    <el-input disabled v-model="userForm.dtAlias" placeholder="请输入设备别名(小写字母)"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="userForm.dtRemark" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="userFormSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import API from '../../api/api'
export default {
    name: "equipmentType",
    data() {
        var checkPhone = (rule, value, callback) => {
            if (value) {
                const reg = /^[a-z]+$/
                if (reg.test(value)) {
                    callback();
                } else {
                    return callback(new Error('别名只能含有小写字母'));
                }
            }
        }
        return {
            condition: {
                dtName: '',
                dcId: null
            },
            dtList: [],
            dcList: [],

            //对话框部分
            userForm: {
                dtName: '',
                dcId: '',
                dtAlias: '',
                dtRemark: '',
            },
            rules: {
                dtName: [{required: true, message: '请输入设备类型', trigger: 'blur'}],
                dcId: [{required: true, message: '请选择设备类别', trigger: 'blur'}],
                dtAlias: [{required: true, message: '请输入设备别名', trigger: 'blur'},
                        {validator: checkPhone, trigger: ['blur', 'change']}],
                dtRemark: [{required: true, message: '请输入备注', trigger: 'blur'}]
            },
            isAdd: true,
            dialogVisible: false,
        }
    },
    mounted() {
        this.getDtList();
        this.getDcList()
    },
    methods: {
        //获取用户列表
        getDtList() {
            this.axios({
                url: this.$host + '/admin/device_type/list',
                method: 'get',
            }).then(res => {
                let list = JSON.parse(JSON.stringify(res.data.data))
                if(this.condition.dtName)
                list = [...list.filter(el => {
                    return this.condition.dtName === el.dtName
                })]
                if(this.condition.dcId)
                list = [...list.filter(el => {
                    return this.condition.dcId === el.dcId
                })]
                this.dtList = list;
                this.total = res.data.totalElements
            })
        },
        // 设备类别列表
        getDcList() {
            this.axios({
                url: this.$host + `/admin/device_category/list`,
                method: 'get',
            })
            .then(res => {
                this.dcList = JSON.parse(JSON.stringify(res.data.data));
            })
        },
        // 切换设备类别
        changeDc() {
            this.dcList.forEach(el => {
                if (el.dcId === this.userForm.dcId) {
                    this.userForm.dtAlias = el.dcAlias
                }
            })
        },
        //编辑
        editClick(row) {
            let dtId = row.dtId
            this.isAdd = false;
            this.axios({
                url: this.$host + `/admin/device_type/detail/${dtId}`,
                method: 'get',
            }).then(res => {
                this.userForm = res.data.data
                this.dialogVisible = true;
            })
        },
        //对话框关闭
        handleClose() {
            this.userForm = {
                dtName: '',
                dcId: '',
                dtAlias: '',
                dtRemark: '',
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
            let params = {
                dtName: this.userForm.dtName,
                dcId: this.userForm.dcId,
                dtAlias: this.userForm.dtAlias,
                dtRemark: this.userForm.dtRemark
            };
            this.axios({
                url: this.$host + '/admin/device_type/create',
                method: 'post',
                data: params
            }).then(res => {
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.getDtList();
                    this.dialogVisible = false
                } else {
                    this.$message.error(res.data.message);
                }
            })

        },
        //编辑ajax
        editAjax() {
            let params = {
                dtId: this.userForm.dtId,
                dtName: this.userForm.dtName,
                dcId: this.userForm.dcId,
                dtAlias: this.userForm.dtAlias,
                dtRemark: this.userForm.dtRemark
            };
            this.axios({
                url: this.$host + '/admin/device_type/update',
                method: 'post',
                data: params
            })
            .then(res => {
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.getDtList();
                    this.dialogVisible = false
                } else {
                    this.$message.error(res.data.message);
                }
            })
            .catch(err => {
                this.$message.error(res.data.message);
            })

        },
    },
}
</script>

<style lang="scss" scoped>
    #users {
        position: relative;
        .userForm {
            > div {
                width: 590px;
            }
            .el-form-item {
                margin-right: 0;
            }
            .el-input {
                width: 450px;
            }
            // .el-form-item + .el-form-item {
            //     margin-left: 10px;
            // }
            .el-textarea {
                width: 505px;
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

    .page {
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
    }

    .recycle {
        border-color: #f37a31;
        background-color: #f37a31;
    }

    .recycle:hover {
        border-color: #f37a31;
    }
</style>

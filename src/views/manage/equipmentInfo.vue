<template>
    <div id="users">
        <div class="search">
            <el-form :inline="true" label-position="left" :model="condition" label-width="0.36rem">
                <div>
                    <el-form-item label="设备编号">
                        <el-input v-model="condition.modelCode" placeholder="请输入设备编号"></el-input>
                    </el-form-item>
                    <el-form-item label="设备名称">
                        <el-input v-model="condition.deviceName" placeholder="请输入设备名称"></el-input>
                    </el-form-item>
                    <el-form-item label="设备状态">
                        <el-select v-model="condition.deviceStatus" placeholder="请选择设备状态" clearable>
                            <el-option label="启用" value="0"></el-option>
                            <el-option label="禁用" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-button @click="page = 1; getDeviceList(page,pageSize)">查询</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="btns">
            <el-button round size="mini" @click="dialogVisible = true">添加</el-button>
            <!-- <el-button type="danger" plain round size="mini">删除</el-button> -->
        </div>
        <div class="table">
            <el-table
                ref="multipleTable"
                :data="usersList"
                height="100%"
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{textAlign:'center',backgroundColor:'#F6F6F6'}"
                :cell-style="{textAlign:'center'}">
                <el-table-column
                    prop="modelCode"
                    label="设备编号">
                </el-table-column>
                <el-table-column
                    prop="deviceName"
                    label="设备名称">
                </el-table-column>
                <el-table-column
                    prop="deviceSpecifications"
                    label="设备规格">
                </el-table-column>
                <!-- <el-table-column
                        prop="userName"
                        label="设备存放位置">
                </el-table-column> -->
                <el-table-column
                    prop="dtName"
                    label="设备类型">
                </el-table-column>
                <el-table-column
                    prop="dcName"
                    label="设备类别">
                </el-table-column>
                <!-- <el-table-column
                        prop="areaName"
                        label="使用地点">
                </el-table-column> -->
                <el-table-column
                    prop="deviceStatus"
                    label="设备状态"
                    width="80">
                    <template slot-scope="scope">
                        {{ scope.row.deviceStatus === 1 ? '禁用' : '启用'}}
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    prop="deviceBuyDate"
                    label="购置日期"
                    width="200">
                </el-table-column> -->
                <el-table-column
                    prop="manufacturer"
                    label="生产厂家">
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="上次操作时间"
                    width="200">
                </el-table-column>
                <el-table-column
                    label="操作"
                    min-width="200"
                    width="200">
                    <template slot-scope="scope">
                        <div class="operation">
                            <el-button type="text" icon="el-icon-user-solid"
                                       :disabled="scope.row.userStatus === 'delete'" @click="editClick(scope.row)">编辑
                            </el-button>
                            <!-- <el-button type="text" icon="el-icon-edit-outline" @click="forbiddenClick(scope.row)">禁用
                            </el-button> -->
                            <!-- <el-button type="text" icon="el-icon-delete" :disabled="scope.row.userStatus === 'delete'"
                                       @click="deleteClick(scope.row)">删除
                            </el-button> -->
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                background
                :current-page="page"
                :page-sizes="[10, 20, 30, 40, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

        <el-dialog
            :title="isAdd ? '添加设备' : '编辑设备'"
            :visible.sync="dialogVisible"
            width="700px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="handleClose">
            <el-form class="userForm" :inline="true" ref="userForm" :rules="rules" :model="userForm" label-width="100px">
                <div>
                    <el-form-item label="设备编号" prop="modelCode">
                        <el-input v-model="userForm.modelCode" placeholder="请输入设备编号" :readonly="!isAdd"></el-input>
                    </el-form-item>
                    <el-form-item label="设备名称" prop="deviceName">
                        <el-input v-model="userForm.deviceName" placeholder="请输入设备名称" :readonly="!isAdd"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="设备类型" prop="dtId">
                        <el-select v-model="userForm.dtId" placeholder="请输入设备类型" @change="changeDt">
                            <el-option v-for="(item, index) in dtList" :key="index" :label="item.dtName" :value="item.dtId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备类别" prop="dcId">
                        <el-select disabled v-model="userForm.dcId" placeholder="请选择设备类别">
                            <el-option v-for="(item, index) in dcList" :key="index" :label="item.dcName" :value="item.dcId"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="设备规格" prop="deviceSpecifications">
                        <el-input v-model="userForm.deviceSpecifications" placeholder="请输入设备规格"></el-input>
                    </el-form-item>
                    <el-form-item label="生产厂家" prop="manufacturer">
                        <el-input v-model="userForm.manufacturer" placeholder="请输入生产厂家"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="购置日期" prop="deviceBuyDate">
                        <el-date-picker
                            v-model="userForm.deviceBuyDate"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            placeholder="选择购置日期">
                        </el-date-picker>
                    </el-form-item> -->
                </div>
                <div v-if="!isAdd">
                    <el-form-item label="上次维修时间">
                        <el-date-picker
                            disabled
                            v-model="userForm.updateTime"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            placeholder="选择上次维修时间">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <!-- <el-form-item label="传感器编号">
                    <el-input v-model="userForm.userTrueName" placeholder="请输入传感器编号"></el-input>
                </el-form-item> -->
                <el-form-item label="设备状态">
                    <el-radio-group v-model="userForm.deviceStatus">
                        <el-radio :label="0">启用</el-radio>
                        <el-radio :label="1">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div>
                    <el-form-item label="备注">
                        <el-input type="textarea" :autosize="{minRows:3,maxRows:6}" resize="none"
                                  v-model="userForm.deviceRemarks" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </div>
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
    name: "equipmentInfo",
    data() {
        return {
            condition: {
                modelCode: '',
                deviceName: '',
                deviceStatus: '',
            },
            usersList: [],
            dtList: [],
            dcList: [],
            userSelection: [],
            page: 1,
            pageSize: 10,//每页条数
            total: 0,//总条数
            //对话框部分
            userForm: {
                modelCode: '',
                deviceName: '',
                dtId: '',
                dcId: '',
                deviceSpecifications: '',
                // deviceBuyDate: '',
                manufacturer: '',
                updateTime: '',
                deviceStatus: 0,
                deviceRemarks: '',
            },
            rules: {
                modelCode: [{required: true, message: '请输入设备编号', trigger: 'blur'}],
                deviceName: [{required: true, message: '请输入设备名称', trigger: 'blur'}],
                dtId: [{required: true, message: '请输入设备类型', trigger: 'blur'}],
                dcId: [{required: true, message: '请选择设备类别', trigger: 'blur'}],
                deviceSpecifications: [{required: true, message: '请输入设备规格', trigger: 'blur'}],
                // deviceBuyDate: [{required: true, message: '请选择购置日期', trigger: 'blur'}],
                manufacturer: [{required: true, message: '请输入生产厂家', trigger: 'blur'}],
            },
            isAdd: true,
            dialogVisible: false,
        }
    },
    mounted() {
        this.getDeviceList(this.page, this.pageSize);
        this.getDtList()
        this.getDcList()
    },
    methods: {
        //获取用户列表
        getDeviceList(current, size) {
            let form = {}
            for(let item in this.condition) {
                if(!!this.condition[item]) {
                    form[item] = this.condition[item]
                }
            }
            this.axios({
                url: this.$host + `/admin/device/admin/list/${current}/${size}`,
                method: 'post',
                data: form
            }).then(res => {
                this.usersList = JSON.parse(JSON.stringify(res.data.data.content));
                this.total = res.data.data.totalElements
            })
        },
        // 设备类型列表
        getDtList() {
            this.axios({
                url: this.$host + `/admin/device_type/list`,
                method: 'get',
            })
            .then(res => {
                this.dtList = JSON.parse(JSON.stringify(res.data.data));
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
        changeDt() {
            this.dtList.forEach(el => {
                if (el.dtId === this.userForm.dtId) {
                    this.userForm.dcId = el.dcId
                }
            })
        },
        //编辑
        editClick(row) {
            let deviceId = row.deviceId
            this.isAdd = false;
            this.axios({
                url: this.$host + `/admin/device/admin/detail/${deviceId}`,
                method: 'get',
            }).then(res => {
                this.userForm = JSON.parse(JSON.stringify(res.data.data))
                this.dialogVisible = true;
            })
        },
        //对话框关闭
        handleClose() {
            this.userForm = {
                modelCode: '',
                deviceName: '',
                dtId: '',
                dcId: '',
                deviceSpecifications: '',
                manufacturer: '',
                updateTime: '',
                deviceStatus: 0,
                deviceRemarks: '',
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
                modelCode: this.userForm.modelCode,
                deviceName: this.userForm.deviceName,
                dtId: this.userForm.dtId,
                dcId: this.userForm.dcId,
                deviceSpecifications: this.userForm.deviceSpecifications,
                // deviceBuyDate: this.userForm.deviceBuyDate,
                manufacturer: this.userForm.manufacturer,
                deviceStatus: this.userForm.deviceStatus,
                deviceRemarks: this.userForm.deviceRemarks,
            };
            this.axios({
                url: this.$host + `/admin/device/admin/create`,
                method: 'post',
                data: params
            })
            .then(res => {
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.getDeviceList(this.page, this.pageSize)
                    this.dialogVisible = false
                } else {
                    this.$message.error(res.data.message);
                }
            })
            .catch(err => {
                this.$message.error(res.data.message);
            })

        },
        //编辑ajax
        editAjax() {
            let params = {
                deviceId: this.userForm.deviceId,
                modelCode: this.userForm.modelCode,
                deviceName: this.userForm.deviceName,
                dtId: this.userForm.dtId,
                dcId: this.userForm.dcId,
                deviceSpecifications: this.userForm.deviceSpecifications,
                // deviceBuyDate: this.userForm.deviceBuyDate,
                manufacturer: this.userForm.manufacturer,
                deviceStatus: this.userForm.deviceStatus,
                deviceRemarks: this.userForm.deviceRemarks,
            }
            let dtAlias = this.userForm.dtAlias
            this.axios({
                url: this.$host + `/admin/device/${dtAlias}/update`,
                method: 'post',
                data: params
            }).then(res => {
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.getDeviceList(this.page, this.pageSize)
                    this.dialogVisible = false
                } else {
                    this.$message.error(res.data.message);
                }
            })

        },

        //页数发生改变
        handleCurrentChange(val) {
            this.page = val;
            this.getDeviceList(this.page, this.pageSize);
        },
        //每页显示条数改变
        handleSizeChange(val) {
            this.pageSize = val;
            this.getDeviceList(this.page, this.pageSize);
        },
    },
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

    .page {
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
    }

    .userForm {
        > div {
            width: 650px;
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

    .recycle {
        border-color: #f37a31;
        background-color: #f37a31;
    }

    .recycle:hover {
        border-color: #f37a31;
    }
</style>

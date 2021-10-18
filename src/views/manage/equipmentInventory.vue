
<template>
    <div id="users">
        <div class="search">
            <el-form :inline="true" label-position="left" :model="condition" label-width="0.56rem">
                <div>
                    <el-form-item label="设备类型">
                        <el-select clearable v-model="condition.dtId" placeholder="请选择设备类型">
                            <!-- <el-option label="全部" value=""></el-option> -->
                            <el-option v-for="(item, index) in dtList" :key="index" :label="item.dtName" :value="item.dtId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备入库时间">
                        <el-date-picker
                            v-model="condition.time"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <!-- <el-form-item label="设备类别">
                        <el-select v-model="condition.dcId" placeholder="请选择设备类别">
                            <el-option label="全部" value=""></el-option>
                            <el-option v-for="(item, index) in dcList" :key="index" :label="item.dcName" :value="item.dcId"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label=" ">
                        <el-button @click="page = 1; getInventoryList(page,pageSize)">查询</el-button>
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
                :cell-style="{textAlign:'center'}"
                @selection-change="handleSelectionChange">
                <!-- <el-table-column
                    prop="deviceCode"
                    label="设备编号">
                </el-table-column> -->
                <el-table-column
                    prop="pId"
                    label="库存编号">
                </el-table-column>
                <el-table-column
                    prop="stockSerial"
                    label="设备序列号">
                </el-table-column>
                <el-table-column
                    prop="deviceName"
                    label="设备名称">
                </el-table-column>
                <el-table-column
                    prop="areaName"
                    label="设备存放位置">
                </el-table-column>
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
                        label="使用地点"
                        >
                </el-table-column> -->
                <el-table-column
                    prop="productStatus"
                    label="设备状态">
                    <template slot-scope="scope">
                        {{ productStatus[scope.row.productStatus] }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="inStorageTime"
                    label="购置日期"
                    width="200">
                </el-table-column>
                <!-- <el-table-column
                    prop="manufacturer"
                    label="生产厂家">
                </el-table-column> -->
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
            width="750px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="handleClose">
            <el-form class="userForm" :inline="true" ref="userForm" :rules="rules" :model="userForm" label-width="120px">
                <div>
                    <el-form-item label="设备" prop="deviceId">
                        <!-- <el-input v-model="userForm.deviceName" placeholder="请输入设备名称"></el-input> -->
                        <el-select v-model="userForm.deviceId" placeholder="请选择设备名称" @change="changeDeviceId">
                            <el-option v-for="(item, index) in deviceList" :key="index" :label="item.deviceName+'—'+item.modelCode" :value="item.deviceId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="购置日期" prop="inStorageTime">
                        <el-date-picker
                            v-model="userForm.inStorageTime"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            placeholder="选择购置日期">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="设备类型">
                        <el-select disabled v-model="userForm.dtId" placeholder="请输入设备类型">
                            <el-option v-for="(item, index) in dtList" :key="index" :label="item.dtName" :value="item.dtId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备类别">
                        <el-select disabled v-model="userForm.dcId" placeholder="请选择设备类别">
                            <el-option v-for="(item, index) in dcList" :key="index" :label="item.dcName" :value="item.dcId"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="设备存放位置" prop="areaId">
                        <el-select v-model="userForm.areaId" placeholder="请选择设备存放位置">
                            <el-option v-for="(item, index) in areaList" :key="index" :label="item.areaName" :value="item.areaId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上次操作时间">
                        <el-date-picker
                            disabled
                            v-model="userForm.updateTime"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            placeholder="选择上次操作时间">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="设备序列号" prop="stockSerial">
                        <el-input v-model="userForm.stockSerial" placeholder="请输入设备序列号"></el-input>
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
                dtId: '',
                time: ''
            },
            usersList: [],
            productStatus: ['正常',  '调拨中', '维修中', '已报废', '停用'],
            alias: '',
            dtList: [],
            dcList: [],
            areaList: [],
            deviceList: [],
            userSelection: [],
            page: 1,
            pageSize: 10,//每页条数
            total: 0,//总条数
            //对话框部分
            userForm: {
                deviceId: '',
                dtId: '',
                dcId: '',
                inStorageTime: '',
                updateTime: '',
                areaId: '',
            },
            rules: {
                deviceId: [{required: true, message: '请选择设备名称', trigger: 'blur'}],
                // deviceName: [{required: true, message: '请输入设备名称', trigger: 'blur'}],
                areaId: [{required: true, message: '请选择存放位置', trigger: 'blur'}],
                stockSerial: [{required: true, message: '请输入设备序列号', trigger: 'blur'}],
                inStorageTime: [{required: true, message: '请输入购置日期', trigger: 'blur'}],
            },
            isAdd: true,
            dialogVisible: false,
        }
    },
    mounted() {
        this.alias = localStorage.userName
        this.getInventoryList(this.page, this.pageSize);
        this.getDtList()
        this.getDcList()
        this.getAreaList()
        this.getDeviceList()
    },
    methods: {
        //获取用户列表
        getInventoryList(current, size) {
            let form = {}
            if(this.condition.dtId) form.dtId = this.condition.dtId
            if(this.condition.time) {
                form.leftTime = this.condition.time[0]
                form.rightTime = this.condition.time[1]
            }
            this.axios({
                url: this.$host + `/${this.alias}/stock/list/${current}/${size}`,
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
                url: this.$host + `/helper/device_type/list`,
                method: 'get',
            })
            .then(res => {
                let list = JSON.parse(JSON.stringify(res.data.data));
                list = [...list.filter(el => {
                    return this.alias === el.dtAlias
                })]
                this.dtList = list;
            })
        },
        // 设备类别列表
        getDcList() {
            this.axios({
                url: this.$host + `/helper/device_category/list`,
                method: 'get',
            })
            .then(res => {
                this.dcList = JSON.parse(JSON.stringify(res.data.data));
            })
        },
        // 地区列表
        getAreaList() {
            this.axios({
                url: this.$host + `/helper/area/listAll`,
                method: 'get',
            })
            .then(res => {
                this.areaList = JSON.parse(JSON.stringify(res.data.data));
            })
        },
        // 设备信息列表
        getDeviceList() {
            this.axios({
                url: this.$host + `/helper/device/${this.alias}/listAll`,
                method: 'get',
            })
            .then(res => {
                this.deviceList = JSON.parse(JSON.stringify(res.data.data));
            })
        },
        // 切换设备类型
        changeDeviceId() {
            this.deviceList.forEach(el => {
                if (el.deviceId === this.userForm.deviceId) {
                    this.userForm.dcId = el.dcId
                    this.userForm.dtId = el.dtId
                    this.userForm.updateTime = el.updateTime
                }
            })
        },
        //表格选择变化
        handleSelectionChange(val) {
            this.userSelection = val
        },
        //编辑
        editClick(row) {
            let pId = row.pId
            this.isAdd = false;
            this.axios({
                url: this.$host + `/${this.alias}/stock/detail/${pId}`,
                method: 'get',
            }).then(res => {
                this.userForm = JSON.parse(JSON.stringify(res.data.data))
                this.dialogVisible = true;
            })
        },
        //对话框关闭
        handleClose() {
            this.userForm = {
                deviceId: '',
                dtId: '',
                dcId: '',
                inStorageTime: '',
                updateTime: '',
                areaId: '',
                stockSerial: '',
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
                deviceId: this.userForm.deviceId,
                areaId: this.userForm.areaId,
                inStorageTime: this.userForm.inStorageTime + ' 00:00:01',
                stockSerial: this.userForm.stockSerial,
                productStatus: '0',
            };
            this.axios({
                url: this.$host + `/${this.alias}/stock/create`,
                method: 'post',
                data: params
            }).then(res => {
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.getInventoryList(this.page, this.pageSize)
                    this.dialogVisible = false
                } else {
                    this.$message.error(res.data.message);
                }
            })

        },
        //编辑ajax
        editAjax() {
            let data = this.userForm
            this.axios({
                url: this.$host + `/${this.alias}/stock/update`,
                method: 'post',
                data
            }).then(res => {
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.getInventoryList(this.page, this.pageSize)
                    this.dialogVisible = false
                } else {
                    this.$message.error(res.data.message);
                }
            })

        },

        //页数发生改变
        handleCurrentChange(val) {
            this.page = val;
            this.getInventoryList(this.page, this.pageSize);
        },
        //每页显示条数改变
        handleSizeChange(val) {
            this.pageSize = val;
            this.getInventoryList(this.page, this.pageSize);
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
            width: 700px;
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

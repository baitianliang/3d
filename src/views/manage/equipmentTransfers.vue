
<template>
    <div id="users">
        <div class="search">
            <el-form :inline="true" label-position="left" :model="condition" label-width="0.56rem">
                <el-form-item label="调拨单号">
                    <el-input v-model="condition.aId" placeholder="请输入调拨单号"></el-input>
                </el-form-item>
                <el-form-item label="调拨建立时间">
                    <el-date-picker
                        v-model="condition.time"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button @click="page = 1; getTransferList(page,pageSize)">查询</el-button>
                </el-form-item>
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
                    prop="aId"
                    label="调拨单号">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            size="mini"
                            @click="editClick(scope.row)">
                            {{ scope.row.aId }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="beginTime"
                    label="调拨开始时间">
                </el-table-column>
                <el-table-column
                    prop="endTime"
                    label="调拨结束时间">
                </el-table-column>
                <el-table-column
                    prop="aStatus"
                    label="调拨状态">
                    <template slot-scope="scope">
                        {{ productStatus[scope.row.aStatus] }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="aUserName"
                    label="调拨人员">
                </el-table-column>
                <!-- <el-table-column
                    prop="aRemark"
                    label="备注">
                </el-table-column> -->
                <el-table-column
                    label="操作"
                    min-width="200"
                    width="200">
                    <template slot-scope="scope">
                        <div class="operation">
                            <!-- <el-button
                                type="primary"
                                v-if="scope.row.aStatus === 0"
                                round
                                size="mini"
                                @click="allot(scope.row)">
                                开始调拨
                            </el-button> -->
                            <el-button
                                type="warning"
                                v-if="scope.row.aStatus === 1"
                                round
                                size="mini"
                                @click="endAllot(scope.row)">
                                结束调拨
                            </el-button>
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
            title="设备调拨"
            :visible.sync="dialogVisible"
            width="1000px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="handleClose">
            <el-form v-if="isAdd" class="userForm" :inline="true" ref="userForm" :rules="rules" :model="userForm" label-width="70px">
                <div>
                    <el-form-item label="调拨人" prop="aUserName">
                        <el-input v-model="userForm.aUserName" placeholder="请输入调拨人姓名" :readonly="!isAdd"></el-input>
                    </el-form-item>
                </div>
                <el-button type="mini" @click="resetPwd">添加</el-button>
            </el-form>
            <el-table
                ref="multipleTable"
                :data="detailList"
                height="400px"
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{textAlign:'center',backgroundColor:'#F6F6F6'}"
                :cell-style="{textAlign:'center'}">
                <el-table-column
                    prop="pId"
                    label="库存编号"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="deviceName"
                    label="设备名称">
                </el-table-column>
                <el-table-column
                    prop="areaName"
                    label="存放地点">
                    <template slot-scope="scope">
                        <span v-if="isAdd">{{scope.row.areaName}}</span>
                        <span v-else>{{scope.row.outAreaName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="inAreaId"
                    label="调入地点">
                    <template slot-scope="scope">
                        <el-select v-if="isAdd" v-model="scope.row.inAreaId" placeholder="请选择设备存放位置">
                            <el-option v-for="(item, index) in areaList" :key="index" :label="item.areaName" :value="item.areaId"></el-option>
                        </el-select>
                        <span v-else>{{scope.row.inAreaName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="chargeMan"
                    label="负责人"
                    width="230">
                    <template slot-scope="scope">
                        <el-input v-if="isAdd" v-model="scope.row.chargeMan" placeholder="请输入负责人姓名"></el-input>
                        <span v-else>{{scope.row.chargeManName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="isAdd"
                    label="操作"
                    min-width="100"
                    width="100">
                    <template slot-scope="scope">
                        <div class="operation">
                            <el-button
                                type="text"
                                round
                                size="mini"
                                @click="deleteDevice(scope.row, scope.$index)">
                                删除 
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <span v-if="isAdd" slot="footer" class="dialog-footer">
                <el-button type="primary" @click="userFormSubmit">开始调拨</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="调拨设备"
            :visible.sync="deviceDialogVisible"
            width="850px"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <div v-if="handleList.length">
                <span style="display: inline-block; width: 0.405rem">已选设备:</span>
                <el-tag
                    v-for="(item, index) in handleList"
                    style="margin-left: 10px; margin-bottom: 10px"
                    :key="index"
                    @close="handleDelete(index)"
                    closable>
                    {{item.pId + item.deviceName}}
                </el-tag>
            </div>
            <el-form :inline="true" label-position="left" :model="deviceDialogForm" label-width="0.46rem">
                <el-form-item label="设备编号">
                    <el-input v-model="deviceDialogForm.pId" placeholder="请输入设备编号"></el-input>
                </el-form-item>
                <el-form-item label="设备序列号">
                    <el-input v-model="deviceDialogForm.stockSerial" placeholder="请输入设备序列号"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button @click="deviceDialogPage = 1; getDeviceList(deviceDialogPage, deviceDialogPageSize)">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table
                ref="multipleTable"
                :data="deviceList"
                height="400px"
                tooltip-effect="dark"
                style="width: 100%"
                @row-click="rowClick"
                :header-cell-style="{textAlign:'center',backgroundColor:'#F6F6F6'}"
                :cell-style="{textAlign:'center'}">
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
                    label="存放地点">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="入库时间">
                </el-table-column>
            </el-table>
            <div class="page">
                <el-pagination
                    @size-change="dialogHandleSizeChange"
                    @current-change="dialogHandleCurrentChange"
                    background
                    :current-page="deviceDialogPage"
                    :page-sizes="[10, 20, 30, 40, 50]"
                    :page-size="deviceDialogPageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="deviceDialogTotal">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deviceDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="pushHandleList">确 定</el-button>
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
                aId: null,
                time: null,
                leftDate: '',
                rightDate: ''
            },
            usersList: [],
            productStatus: ['未开始', '进行中', '结束'],
            alias: '',
            page: 1,
            pageSize: 10,//每页条数
            total: 0,//总条数
            //对话框部分
            detailList: [],
            userForm: {
                aUserName: '',
            },
            rules: {
                aUserName: [{required: true, message: '请输入调拨人姓名', trigger: 'blur'}],
            },
            isAdd: true,
            dialogVisible: false,
            deviceDialogVisible: false,
            deviceDialogForm: {
                pId: '',
                stockSerial: '',
            },
            deviceDialogPage: 1,
            deviceDialogPageSize: 10,
            deviceDialogTotal: 0,//总条数
            areaList: [],
            deviceList: [],
            handleList: []
        }
    },
    mounted() {
        this.alias = localStorage.userName
        this.getTransferList(this.page, this.pageSize);
        this.getAreaList()
    },
    methods: {
        //获取用户列表
        getTransferList(current, size) {
            let form = {}
            if(this.condition.aId) form.aId = this.condition.aId
            if(this.condition.time) {
                form.leftDate = this.condition.time[0]
                form.rightDate = this.condition.time[1]
            }
            this.axios({
                url: this.$host + `/${this.alias}/allocation/list/${current}/${size}`,
                method: 'post',
                data: form
            }).then(res => {
                this.usersList = JSON.parse(JSON.stringify(res.data.data.content));
                this.total = res.data.data.totalElements
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
        // 获取可操作设备列表
        async getDeviceList(page, size) {
            let data = {}
            if(this.deviceDialogForm.pId) data.pId = this.deviceDialogForm.pId
            if(this.deviceDialogForm.stockSerial) data.stockSerial = this.deviceDialogForm.stockSerial
            this.axios({
                url: this.$host + `/${this.alias}/stock/listPure/${page}/${size}`,
                method: 'post',
                data
            })
            .then(res => {
                this.deviceList = JSON.parse(JSON.stringify(res.data.data.content));
                this.deviceDialogTotal = res.data.data.totalElements
            })
        },
        // 结束调拨
        endAllot(row) {
            this.$confirm('是否确认结束调拨', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            })
            .then(() => {
                let aId = row.aId
                this.axios({
                    url: this.$host + `/${this.alias}/allocation/finish/${aId}`,
                    method: 'get',
                })
                .then(res => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                        this.getTransferList(this.page, this.pageSize);
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
            })
            .catch(() => {});
        },
        // 添加按钮(添加调拨设备)
        resetPwd() {
            this.getDeviceList(this.deviceDialogPage, this.deviceDialogPageSize)
            .then(() => {
                this.deviceDialogVisible = true
                this.handleList = [...this.detailList]
            })
        },
        // 点击表格行选中设备
        rowClick(val) {
            let bool = false
            this.handleList.forEach(({pId}) => {
                if (val.pId === pId)
                return bool = true
            })
            if(bool)
            return this.$message.error('请勿重复添加同一设备')
            this.handleList = [...this.handleList, val]
        },
        // 删除已选设备
        handleDelete(index) {
            this.handleList.splice(index, 1);
        },
        // 添加设备
        pushHandleList() {
            this.detailList = [...this.handleList]
            this.deviceDialogVisible = false
        },
        // 删除设备
        deleteDevice(row, index) {
            this.detailList.splice(index, 1);
        },
        //详情
        editClick(row) {
            let aId = row.aId
            this.isAdd = false;
            this.axios({
                url: this.$host + `/${this.alias}/allocation/detail/${aId}`,
                method: 'get',
            }).then(res => {
                if (res.data.code === 0) {
                    this.detailList = res.data.data.detail
                    this.dialogVisible = true;
                } else {
                    this.$message.error(res.data.message);
                }
            })
        },
        //对话框关闭
        handleClose() {
            this.userForm = {
                aUserName: '',
            };
            this.deviceDialogForm = {
                pId: '',
                stockSerial: '',
            },
            this.detailList = [];
            this.isAdd = true;
            this.$refs.userForm.clearValidate();
        },
        //对话框确定按钮
        userFormSubmit() {
            this.$refs.userForm.validate((valid) => {
                if (valid) {
                    this.addAjax()
                } else {
                    return false;
                }
            })
        },
        //添加ajax
        addAjax() {
            if(!this.handleList.length)
            return this.$message.error('请添加调拨设备')
            let bool = false,
            list = []
            this.handleList.forEach( el => {
                list.push({pId: el.pId, inAreaId: el.inAreaId, chargeMan: el.chargeMan})
                if(!el.inAreaId || !el.chargeMan)
                return bool = true
            })
            if(bool)
            return this.$message.error('请填写完整')
            let params = {
                aUserName: this.userForm.aUserName,
                allocationDetailListStr: JSON.stringify(list)
            };
            this.axios({
                url: this.$host + `/${this.alias}/allocation/create`,
                method: 'post',
                data: params
            }).then(res => {
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.getTransferList(this.page, this.pageSize)
                    this.dialogVisible = false
                } else {
                    this.$message.error(res.data.message);
                }
            })
        },

        //页数发生改变
        handleCurrentChange(val) {
            this.page = val;
            this.getTransferList(this.page, this.pageSize);
        },
        //每页显示条数改变
        handleSizeChange(val) {
            this.pageSize = val;
            this.getTransferList(this.page, this.pageSize);
        },
        dialogHandleCurrentChange(val) {
            this.deviceDialogPage = val;
            this.getDeviceList(this.deviceDialogPage, this.deviceDialogPageSize)
        },
        dialogHandleSizeChange(val) {
            this.deviceDialogPageSize = val;
            this.getDeviceList(this.deviceDialogPage, this.deviceDialogPageSize)
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

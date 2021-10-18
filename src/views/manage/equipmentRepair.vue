<template>
    <div id="users">
        <div class="search">
            <el-form :inline="true" label-position="left" :model="condition" label-width="0.36rem">
                <div>
                    <el-form-item label="维修单号">
                        <el-input v-model="condition.repairId" placeholder="请输入维修单号"></el-input>
                    </el-form-item>
                    <el-form-item label="设备编号">
                        <el-input v-model="condition.modelCode" placeholder="请输入设备编号"></el-input>
                    </el-form-item>
                    <el-form-item label="报修时间">
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
                        <el-button @click="page = 1; getDeviceList(page,pageSize)">查询</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="btns">
            <el-button round size="mini" @click="dialogVisible = true">创建</el-button>
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
                    prop="repairId"
                    label="维修单号">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            size="mini"
                            @click="editClick(scope.row)">
                            {{ scope.row.repairId }}
                        </el-button>
                    </template>
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
                    prop="repairUserName"
                    label="报修人员">
                </el-table-column>
                <el-table-column
                    prop="chargeManName"
                    label="负责人员">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="报修时间"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="维修状态">
                    <template slot-scope="scope">
                        {{ statusList[scope.row.status] }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="findishTime"
                    label="维修完时间"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="备注">
                </el-table-column>
                <el-table-column
                    label="操作"
                    min-width="200"
                    width="200">
                    <template slot-scope="scope">
                        <div class="operation">
                            <el-button
                                type="primary"
                                v-if="scope.row.status === 0"
                                round
                                size="mini"
                                @click="repair(scope.row)">
                                开始维修
                            </el-button>
                            <el-button
                                type="warning"
                                v-if="scope.row.status === 1"
                                round
                                size="mini"
                                @click="endRepair(scope.row)">
                                维修完成
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
            title="设备报修"
            :visible.sync="dialogVisible"
            width="680px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="handleClose">
            <el-form class="userForm" :inline="true" ref="userForm" :rules="rules" :model="userForm" label-width="90px">
                <div>
                    <el-form-item label="报修人" prop="repairUserName">
                        <el-input :disabled="!isAdd" v-model="userForm.repairUserName" placeholder="请输入报修人姓名"></el-input>
                    </el-form-item>
                    <el-button v-if="isAdd" type="warning" style="margin-left: 0.416rem" @click="resetPwd">选择设备</el-button>
                </div>
                <div>
                    <el-form-item label="设备序列号">
                        <el-input disabled v-model="userForm.stockSerial" placeholder="请选择设备"></el-input>
                    </el-form-item>
                    <el-form-item label="设备名称">
                        <el-input disabled v-model="userForm.deviceName" placeholder="请选择设备"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="负责人" prop="chargeManName">
                        <el-input :disabled="!isAdd" v-model="userForm.chargeManName" placeholder="请输入负责人姓名"></el-input>
                    </el-form-item>
                    <el-form-item v-if="!isAdd" label="报修时间">
                        <el-date-picker
                            disabled
                            v-model="userForm.createTime"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            placeholder="选择报修时间">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="报修描述" prop="reportDesc">
                        <el-input :disabled="!isAdd" type="textarea" :autosize="{minRows:3,maxRows:6}" resize="none"
                                  v-model="userForm.reportDesc" placeholder="请输入报修描述"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="备注" prop="remark">
                        <el-input :disabled="!isAdd" type="textarea" :autosize="{minRows:3,maxRows:6}" resize="none"
                                  v-model="userForm.remark" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="故障照片">
                        <div class="upload">
                            <el-upload
                                v-if="isAdd"
                                class="avatar-uploader"
                                ref="uploadImage"
                                action="http://up-z0.qiniup.com" 
                                bucket="videoslist"
                                :show-file-list="false"
                                :limit="basicPackDefault.maxLength"
                                :accept="basicPackDefault.acceptImage"
                                :multiple="basicPackDefault.multiple"
                                :before-upload="beforeUpload"
                                :on-success="success"
                                :before-remove="deleteUpload"
                                :on-error="uploadError"
                                :auto-upload="true"
                                :data="dataObj">
                                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <el-image v-else :src="imageUrl" class="avatar"></el-image>
                            <!-- <el-button @click="deleteUpload" v-if="imageUrl" type="danger" icon="el-icon-delete" circle></el-button> -->
                        </div>
                    </el-form-item>
                </div>
            </el-form>
            <span v-if="isAdd" slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="userFormSubmit">确 定</el-button>
            </span>
        </el-dialog>
        
        <el-dialog
            title="报修设备"
            :visible.sync="deviceDialogVisible"
            width="850px"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form :inline="true" label-position="left" :model="deviceDialogForm" label-width="0.46rem">
                <el-form-item label="设备编号">
                    <el-input v-model="deviceDialogForm.pId" placeholder="请输入设备编号"></el-input>
                </el-form-item>
                <el-form-item label="设备序列号">
                    <el-input v-model="deviceDialogForm.stockSerial" placeholder="请输入设备序列号"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button @click="deviceDialogPage = 1; getPureList(deviceDialogPage, deviceDialogPageSize)">查询</el-button>
                </el-form-item>
                <div class="dialog_form_title">
                    <span>双击选中设备</span>
                </div>
            </el-form>
            <el-table
                ref="multipleTable"
                :data="deviceList"
                height="400px"
                tooltip-effect="dark"
                style="width: 100%"
                @row-dblclick="pushHandleList"
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
                // deviceCode: '',
                modelCode: '',
                repairId: '',
                time: null,
                beginTime: '',
                endTime: ''
            },
            usersList: [],
            statusList: ['等待维修', '正在维修', '维修完成'],
            alias: '',
            page: 1,
            pageSize: 10,//每页条数
            total: 0,//总条数
            //对话框部分
            userForm: {
                repairUserName: '',
                chargeManName: '',
                reportDesc: '',
            },
            rules: {
                repairUserName: [{required: true, message: '请输入报修人姓名', trigger: 'blur'}],
                chargeManName: [{required: true, message: '请输入负责人姓名', trigger: 'blur'}],
                reportDesc: [{required: true, message: '请输入报修描述', trigger: 'blur'}],
            },
            isAdd: true,
            dialogVisible: false,
            deviceDialogVisible: false,
            deviceDialogForm: {
                pId: '',
                stockSerial: '',
            },
            deviceList: [],
            deviceDialogPage: 1,
            deviceDialogPageSize: 10,
            deviceDialogTotal: 0,//总条数
            basicPackDefault: {
                maxLength: 1,   //最大图片数量
                multiple: true, //可否上传多张
                acceptImage: "image/gif,image/jpeg,image/jpg,image/png",
            },
            dataObj: {token: '', key: '',name:''},
            imageUrl: '',
        }
    },
    mounted() {
        this.alias = localStorage.userName
        this.getDeviceList(this.page, this.pageSize);
    },
    methods: {
        //获取用户列表
        getDeviceList(current, size) {
            let form = {}
            if(this.condition.repairId) form.repairId = this.condition.repairId
            if(this.condition.modelCode) form.modelCode = this.condition.modelCode
            if(this.condition.time) {
                form.beginTime = this.condition.time[0]
                form.endTime = this.condition.time[1]
            }
            this.axios({
                url: this.$host + `/${this.alias}/repair/list/${current}/${size}`,
                method: 'post',
                data: form
            }).then(res => {
                this.usersList = JSON.parse(JSON.stringify(res.data.data.content));
                this.total = res.data.data.totalElements
            })
        },
        // 开始维修
        repair(row) {
            let repairId = row.repairId
            this.axios({
                url: this.$host + `/${this.alias}/repair/begin/${repairId}`,
                method: 'get',
            })
            .then(res => {
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    });
                    this.getDeviceList(this.page, this.pageSize);
                } else {
                    this.$message.error(res.data.message);
                }
            })
        },
        // 添加按钮(添加调拨设备)
        resetPwd() {
            this.getPureList(this.deviceDialogPage, this.deviceDialogPageSize)
            .then(() => {
                this.deviceDialogVisible = true
            })
        },
        // 获取可操作设备列表
        async getPureList(page, size) {
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
        // 添加设备
        pushHandleList(val) {
            this.userForm = {...this.userForm, ...val}
            this.deviceDialogVisible = false
        },

        
        // 删除上传图片
        deleteUpload() {
            this.imageUrl = ''
            this.$refs.uploadImage.clearFiles()
            this.userForm.picUrl = this.imageUrl
        },
        //TODO 上传之前 获取TOKEN
        async beforeUpload(file) {
            this.dataObj.key = file.name;
            this.basicPackDefault.multiple=true;
            // 获取七牛token
            let token = await this.axios({
                url: this.$host + `/helper/pic_token`,
                method: 'get',
            })
            //  axios.getQiniuToken()
            this.dataObj.token = token.data
        },
        //上传成功后
        success(res, file, files) {
            var privateBucketDomain = 'http://sk.jthapp.com/';
            this.imageUrl = privateBucketDomain + res.key
            this.userForm.picUrl = this.imageUrl
        },
        //上传失败后
        uploadError: function (response, file, fileList) {
            this.$message.error("上传失败，请检查文件名是否重复，重新上传！！！")
        },

        // 维修完成
        endRepair(row) {
            this.$confirm('是否确认维修已完成？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            })
            .then(() => {
                let repairId = row.repairId
                this.axios({
                    url: this.$host + `/${this.alias}/repair/finish/${repairId}`,
                    method: 'get',
                })
                .then(res => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                        this.getDeviceList(this.page, this.pageSize);
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
            })
            .catch(() => {});
        },
        //编辑
        editClick(row) {
            let repairId = row.repairId
            this.isAdd = false;
            this.axios({
                url: this.$host + `/${this.alias}/repair/detail/${repairId}`,
                method: 'get',
            }).then(res => {
                this.userForm = JSON.parse(JSON.stringify(res.data.data))
                this.imageUrl = this.userForm.picUrl
                this.dialogVisible = true;
            })
        },
        //对话框关闭
        handleClose() {
            this.userForm = {
                repairUserName: '',
                chargeManName: '',
                pId: '',
                deviceName: '',
                reportDesc: '',
                remark: '',
            };
            this.deviceDialogForm = {
                pId: '',
                stockSerial: '',
            },
            this.imageUrl = ''
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
            // if(!this.imageUrl) return this.$message.error('请上传故障照片')
            let params = {
                repairUserName: this.userForm.repairUserName,
                chargeManName: this.userForm.chargeManName,
                pId: this.userForm.pId,
                deviceName: this.userForm.deviceName,
                reportDesc: this.userForm.reportDesc,
                remark: this.userForm.remark,
                picUrl: this.imageUrl,
            };
            this.axios({
                url: this.$host + `/${this.alias}/repair/create`,
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
        dialogHandleCurrentChange(val) {
            this.deviceDialogPage = val;
            this.getPureList(this.deviceDialogPage, this.deviceDialogPageSize)
        },
        dialogHandleSizeChange(val) {
            this.deviceDialogPageSize = val;
            this.getPureList(this.deviceDialogPage, this.deviceDialogPageSize)
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
            width: 640px;
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

    .upload {
        display: flex;
        align-items: center;
        .avatar-uploader {
            width: 102px;
            height: 102px;
        }
        .avatar-uploader,.el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader:hover,.el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 100px;
            height: 100px;
            line-height: 100px;
            text-align: center;
        }
        .avatar {
            width: 100px;
            height: 100px;
            display: block;
        }
        .el-button{
            height: 50px;
            width: 50px;
            margin-left: 20px;
        }
    }
    .dialog_form_title {
        width: 100%;
        font-size: 15px;
        color: #808080;
        text-align: end;
        display: inline-block;
    }
</style>

<template>
    <div id="message">
        <div class="btns">
            <el-button round size="mini" @click="dialogVisible = true">添加</el-button>
            <el-button round size="mini" @click="clearMessage">清空</el-button>
        </div>
        <div class="table">
            <el-table
                    ref="multipleTable"
                    :data="messageList"
                    height="100%"
                    tooltip-effect="dark"
                    style="width: 100%"
                    :header-cell-style="{textAlign:'center',backgroundColor:'#F6F6F6'}"
                    :cell-style="{textAlign:'center'}"
            >
                <el-table-column
                        label="序号"
                        type="index"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="messageTitle"
                        label="消息名称"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="messageContent"
                        label="消息内容"
                        width="400">
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="150">
                    <template slot-scope="scope">
                        {{scope.row.messageStatus === 'active'?'未处理':'已处理'}}
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        min-width="200"
                >
                    <template slot-scope="scope">
                        <div class="operation">
                            <el-button type="text" icon="el-icon-check" @click="isOk(scope.row)" v-if="scope.row.messageStatus === 'active'">完成</el-button>
                            <el-button type="text" icon="el-icon-delete" @click="deleteMessage(scope.row)">删除</el-button>
<!--                            <el-button type="text" disabled></el-button>-->
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination :total="total" @paginationChange="paginationChange" ref="pagination"></pagination>
        <el-dialog
                title="创建消息"
                :visible.sync="dialogVisible"
                width="3.229166rem"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @close="handleClose"
        >
            <el-form class="messageForm" ref="messageForm" :rules="rules" :model="messageForm"
                     label-width="0.46875rem">
                <el-form-item label="标题" prop="messageTitle">
                    <el-input v-model="messageForm.messageTitle" placeholder="请输入消息标题"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="messageContent">
                    <el-input type="textarea" :autosize="{minRows:3,maxRows:6}" resize="none"
                              v-model="messageForm.messageContent" placeholder="请输入消息内容"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="onSubmit">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import API from '../../api/api'
    import qs from 'qs'
    import pagination from '../../components/common/pagination'

    export default {
        name: "message",
        components:{
            pagination
        },
        data() {
            return {
                messageList: [],
                messageForm: {
                    messageTitle: '',
                    messageContent: '',
                    messageType: 'alarm',
                },
                rules: {
                    messageTitle: [
                        {required: true, message: '请输入消息标题', trigger: 'blur'},
                    ],
                    messageContent: [
                        {required: true, message: '请输入消息内容', trigger: 'blur'},
                    ],
                },
                dialogVisible: false,
                page: 1,
                pageSize: 10,//每页条数
                total: 0,//总条数
            }
        },
        methods: {
            getList(current, size){
                this.axios({
                    url: this.$http + API.alarmMessageList + (current - 1) * size + '/' + size,
                    method: 'get',
                }).then(res =>{
                    this.messageList = JSON.parse(JSON.stringify(res.data.result));
                    this.total = res.data.totalCount
                })
            },
            onSubmit() {
                this.$refs.messageForm.validate((valid) => {
                    if (valid) {
                        this.axios({
                            url: this.$http + API.alarmMessageAdd,
                            header:{
                                'content-type': 'application/json;charset=UTF-8'
                            },
                            method: 'post',
                            data: this.messageForm
                        }).then(res => {
                            if (res.data.status === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '操作成功!'
                                });
                                this.getList(this.page, this.pageSize);
                                this.dialogVisible = false;
                            } else {
                                this.$message.error(res.data.statusDesc);
                            }
                        })
                    } else {
                        return false;
                    }
                })
            },
            isOk(row){
                this.axios({
                    url: this.$http + API.alarmMessageEdit + row.relationId,
                    method: 'get',
                }).then(res =>{
                    if (res.data.status === 0) {
                        this.$message({
                            type: 'success',
                            message: '处理成功!'
                        });
                        this.getList(this.page, this.pageSize);
                    } else {
                        this.$message.error(res.data.statusDesc)
                    }
                })
            },
            deleteMessage(row){
                this.axios({
                    url: this.$http + API.alarmMessageDelete + row.relationId,
                    method: 'get',
                }).then(res =>{
                    if (res.data.status === 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getList(this.page, this.pageSize);
                    } else {
                        this.$message.error(res.data.statusDesc)
                    }
                })
            },
            handleClose() {
                let timeout = setTimeout(() => {
                    this.from = {
                        messageTitle: '',
                        messageContent: '',
                        messageType: 'alarm',
                    };
                    clearTimeout(timeout)
                }, 300)
                this.$refs.messageForm.clearValidate();
            },
            clearMessage(){
                this.axios({
                    url: this.$http + API.alarmMessageClear,
                    method: 'get',
                }).then(res => {
                    if (res.data.status === 0) {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.getList(this.page, this.pageSize);
                    } else {
                        this.$message.error(res.data.statusDesc);
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
                this.getList(this.page, this.pageSize);
            },
        },
        mounted() {
            this.getList(this.page, this.pageSize);
        }
    }
</script>

<style lang="scss" scoped>
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
        height: calc(100% - 105px);
    }
    .page {
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
    }
    .el-input,.el-textarea{
        width: 420px;
    }
</style>

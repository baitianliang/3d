<template>
    <div id="alarm-management">
        <div class="search">
            <el-form :inline="true" ref="form" label-position="left" :model="searchForm" label-width="0.36rem">
                <div>
                    <el-form-item label="报警时间">
                        <el-select clearable v-model="searchForm.alarmTime">
                            <el-option
                                v-for="(item, index) in alarmTimeOptions"
                                :key="index"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="矿区">
                        <el-select clearable v-model="searchForm.alarmTime">
                            <el-option
                                v-for="(item, index) in alarmTimeOptions"
                                :key="index"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="子矿区">
                        <el-select clearable v-model="searchForm.alarmTime">
                            <el-option
                                v-for="(item, index) in alarmTimeOptions"
                                :key="index"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="报警设备">
                        <el-select clearable v-model="searchForm.alarmTime">
                            <el-option
                                v-for="(item, index) in alarmTimeOptions"
                                :key="index"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="报警类型">
                        <el-select clearable v-model="searchForm.alarmTime">
                            <el-option
                                v-for="(item, index) in alarmTimeOptions"
                                :key="index"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="报警类型">
                        <el-select clearable v-model="searchForm.alarmTime">
                            <el-option
                                v-for="(item, index) in alarmTimeOptions"
                                :key="index"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="alarm-table">
            <el-table
                ref="alarmTable"
                stripe
                :data="tableData"
                :header-cell-style="{textAlign:'center',backgroundColor:'#F6F6F6'}"
                :cell-style="{textAlign:'center'}"
                tooltip-effect="dark">
                <el-table-column
                    header-align="center"
                    align="center"
                    label="选项"
                    width="100">
                    <template slot-scope="scope">
                        <div class="option" :class="scope.row.finished === '1'  ? '' : 'inactive'"></div>
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="序号"
                    type="index"
                    width="100">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        prop="time"
                        align="center"
                        label="报警时间"
                        width="300">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        align="center"
                        label="矿区"
                        width="150">
                </el-table-column>
<!--                <el-table-column-->
<!--                        header-align="center"-->
<!--                        align="center"-->
<!--                        label="子矿区"-->
<!--                        width="100">-->
<!--                </el-table-column>-->
                <el-table-column
                        header-align="center"
                        prop="device"
                        align="center"
                        label="报警设备"
                        width="150">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        align="center"
                        label="报警类型"
                        width="150">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        align="center"
                        label="报警数值"
                        width="150">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        align="center"
                        label="维修状态"
                        width="150">
                    <template slot-scope="scope">
                        <div>{{scope.row.finished === '1'  ? '已维修' : '未处理'}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        header-align="center"
                        align="center"
                        prop="time"
                        label="维修时间"
                        width="200">
                </el-table-column>
                <el-table-column
                        header-align="center"
                        align="center"
                        label="维修人"
                        >
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
    import API from '../../api/api'

    export default {
        name: "alarmManagement",
        data() {
            return {
                searchForm: {
                    alarmTime: ''
                },
                alarmTimeOptions: ["2020-7-20","2020-7-21","2020-7-22"],
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                total: 10,
            }
        },
        methods: {
            getData(){
                this.axios({
                    url:this.$host + API.getMessage,
                    method: 'get',
                }).then(res=>{
                    if (res.data.code === 0){
                        this.tableData = res.data.data.msg;
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
            },
            handleSizeChange(val) {

            },
            handleCurrentChange(val) {

            }
        },
        mounted() {
            this.getData();
        }
    }
</script>

<style lang="scss" scoped>
    .alarm-table{
        height: calc(100% - 165px);
    }

.el-table {
    /*max-height: 500px;*/
    height: 100%;
    .el-table__header-wrapper {
        .el-table__header {
            thead {
                tr {
                    th {
                        background: #FAFAFA;
                    }
                }
            }
        }
    }
    .option {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #eee;
        margin: 0 auto;
    }
    .inactive {
        background: red;
    }
}
.el-pagination {
    display: flex;
    justify-content: flex-end;
    padding: 10px 0;
}
</style>

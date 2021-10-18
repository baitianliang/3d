<template>
    <div>
        <div class="toolbar">
            <div class="search_input">
                <!-- <el-select @change="activityChange" v-model="searchForm.activityId" clearable placeholder="请选择活动">
                    <el-option
                    v-for="item in activityList"
                    :key="item.activityId"
                    :label="item.activityName"
                    :value="item.activityId">
                    </el-option>
                </el-select>
                <el-select v-if="searchForm.activityId" @change="getStatEnroll" v-model="searchForm.activityLevelId" clearable placeholder="请选择组别">
                    <el-option
                    v-for="(item, index) in levelList"
                    :key="index"
                    :label="item.activityLevelName"
                    :value="item.activityLevelId">
                    </el-option>
                </el-select> -->
            </div>
            <el-button @click="getExcel">导出</el-button>
        </div>
        <el-table
            ref="multipleTable"
            border
            :data="tableData"
            tooltip-effect="dark">
            <el-table-column
                header-align="center"
                align="center"
                label="销售人员"
                prop="name"></el-table-column>
            <el-table-column
                header-align="center"
                align="center"
                label="销售时间"
                prop="time"></el-table-column>
            <el-table-column
                header-align="center"
                align="center"
                label="销售省市"
                prop="city"></el-table-column>
            <el-table-column
                header-align="center"
                align="center"
                label="销售公司"
                prop="company"></el-table-column>
            <el-table-column
                header-align="center"
                align="center"
                label="销售数量"
                prop="num"></el-table-column>
        </el-table>
    </div>
</template>

<script>
// import axios from '@/assets/axios/Index.js'
// import provinceAxios from '@/assets/axios/Expert.js'
// import levelAxios from '@/assets/axios/EventManagement.js'
// import regisAxios from '@/assets/axios/RegistrationManagement.js'
export default {
    name: "indexTable",
    data() {
        return {
            searchForm: {
                activityId: '',
                activityLevelId: '',
            },
            activityList: [],
            levelList: [],
            provinceList: [],
            tableData: [],
        }
    },
    mounted() {
        // this.getProvince()
        // this.getStatEnroll()
        this.tableData = [{name: '马富康', time: '2020-01-20', city: '山西', company: '山西玉和泰煤业', num: '1000'},
        {name: '李建国', time: '2020-01-20', city: '山西', company: '山西金晖万峰煤矿', num: '500'},
        {name: '孙志斌', time: '2020-01-20', city: '山东', company: '山东省三河口煤矿', num: '5000'},
        {name: '李玉杰', time: '2020-01-20', city: '山东', company: '山东东泰矿业', num: '1000'},
        {name: '马富康', time: '2020-01-20', city: '山西', company: '山西玉和泰煤业', num: '2000'},
        {name: '王立杰', time: '2020-01-20', city: '山西', company: '山西汾西矿业', num: '10000'},
        {name: '李玉杰', time: '2020-01-20', city: '山东', company: '山东东泰矿业', num: '1000'},
        {name: '马富康', time: '2020-01-20', city: '山西', company: '山西玉和泰煤业', num: '500'},
        {name: '马富康', time: '2020-01-20', city: '山西', company: '山西玉和泰煤业', num: '6000'},
        {name: '孙志斌', time: '2020-01-20', city: '山东', company: '山东省三河口煤矿', num: '1500'},
        {name: '李建国', time: '2020-01-20', city: '山西', company: '山西玉和泰煤业', num: '1000'}]
        // regisAxios.getActivityList()
        // .then(res => {
        //     this.activityList = JSON.parse(JSON.stringify(res.data.result));
        // })
    },
    methods: {
        searchList() {},
        getExcel() {
            require.ensure([], () => {
                const { export_json_to_excel } = require("../../lib/Export2Excel");
                const tHeader = ["销售人员", "销售时间", "销售省市", "销售公司", "销售数量"];// 上面设置Excel的表格第一行的标题
                const filterVal = ["name", "time", "city", "company", "num"]; // 上面的index、nickName、name是tableData里对象的属性
                const list = this.tableData;              //把data里的tableData存到list
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, "销售统计表");   //标题，数据，文件名
                this.exportButton = '导出'
            });
        },
        formatJson(filterVal, jsonData) {
            const arr = []
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
        //获取省份
        getProvince() {
            // provinceAxios.getProvinceList()
            // .then(res => {
            //     this.provinceList = res.data.result
                // this.tableData = this.provinceList
            // })
        },
        // 更改查询活动
        activityChange() {
            this.searchForm.activityLevelId = ''
            this.levelList = []
            this.getActivityLevelList(this.searchForm.activityId, 'levelList')
            .then(() => {
                this.searchForm.activityLevelId = ''
                this.getStatEnroll()
            })
        },
        // 获取赛事组别
        async getActivityLevelList(id, name) {
            if(!id) return
            // levelAxios.getActivityLevelList(id)
            // .then(res => {
            //     this[name] = JSON.parse(JSON.stringify(res.data.result));
            // })
        },
        getStatEnroll() {
            let params = {};
            for(let item in this.searchForm) {
                if(!!this.searchForm[item]) {
                    params[item] = this.searchForm[item]
                }
            }
            // axios.getStatEnroll(params)
            // .then(res => {
            //     let arr = this.provinceList
            //     for(let item in arr) {
            //         arr[item].enrollProvinceNum = String(res.data.result.enrollListProvinceNameMap[arr[item].provinceName] ? res.data.result.enrollListProvinceNameMap[arr[item].provinceName] : 0)
            //         arr[item].enrollOrderProvinceNum = String(res.data.result.enrollListWithOrderProvinceNameMap[arr[item].provinceName] ? res.data.result.enrollListWithOrderProvinceNameMap[arr[item].provinceName] : 0)
            //         arr[item].unEnrollOrderProvinceNum = String(arr[item].enrollProvinceNum - arr[item].enrollOrderProvinceNum)
            //         arr[item].enrollOrderWorkProvinceNum = String(res.data.result.enrollListWithOrderWorkProvinceNameMap[arr[item].provinceName] ? res.data.result.enrollListWithOrderWorkProvinceNameMap[arr[item].provinceName] : 0)
            //         arr[item].unEnrollOrderWorkProvinceNum = String(arr[item].enrollOrderProvinceNum - arr[item].enrollOrderWorkProvinceNum)

            //         arr[item].enrollListWithOrderWorkUnAllocNum = String(res.data.result.enrollListWithOrderWorkUnAllocProvinceNameMap[arr[item].provinceName] ? res.data.result.enrollListWithOrderWorkUnAllocProvinceNameMap[arr[item].provinceName] : 0)
            //         arr[item].enrollListWithOrderWorkInScoreNum = String(res.data.result.enrollListWithOrderWorkInScoreProvinceNameMap[arr[item].provinceName] ? res.data.result.enrollListWithOrderWorkInScoreProvinceNameMap[arr[item].provinceName] : 0)

            //         arr[item].enrollOrderWorkUnScoreProvinceNum = String(res.data.result.enrollListWithOrderWorkScoredProvinceNameMap[arr[item].provinceName] ? res.data.result.enrollListWithOrderWorkScoredProvinceNameMap[arr[item].provinceName] : 0)
            //         arr[item].enrollOrderWorkScoreUpgradeProvinceNum = String(res.data.result.enrollListWithOrderWorkScoreUpGradeProvinceNameMap[arr[item].provinceName] ? res.data.result.enrollListWithOrderWorkScoreUpGradeProvinceNameMap[arr[item].provinceName] : 0)
                    
            //         arr[item].enrollListWithOrderWorkScoreDownGradeNum = String(res.data.result.enrollListWithOrderWorkScoreDownGradeProvinceNameMap[arr[item].provinceName] ? res.data.result.enrollListWithOrderWorkScoreDownGradeProvinceNameMap[arr[item].provinceName] : 0)
            //         // this.tableData[item]
            //     }
            //     this.tableData = [...arr]
            // })
        },
    }
}
</script>
<style lang="scss" scoped>
.toolbar {
    display: flex;
    justify-content: space-between;
    .search_input {
        margin: 20px;
    }
    .el-button {
        margin: 20px;
    }
}
</style>
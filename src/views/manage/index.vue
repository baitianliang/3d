<template>
    <div class="index">
        <div class="index_search">
            <el-form>
                <div class="search_content">
                    <div class="index_search_left">
                        <!-- <el-form-item label="选择活动">
                            <el-select class="active_select" @change="activityChange" v-model="searchForm.activityId" clearable placeholder="请选择活动">
                                <el-option
                                v-for="item in activityList"
                                :key="item.activityId"
                                :label="item.activityName"
                                :value="item.activityId">
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                        <!-- <el-form-item label="选择地区">
        <el-select
            v-model="searchForm.provinceId"
            clearable
            placeholder="请选择省份"
            @change="searchForm.cityId = ''; searchForm.districtId = ''; getCityList(searchForm.provinceId, 'cityOptions')">
            <el-option
              v-for="item in provinceOptions"
              :key="item.provinceId"
              :label="item.provinceName"
              :value="item.provinceId">
            </el-option>
        </el-select>
        <el-select
            v-if="searchForm.provinceId"
            v-model="searchForm.cityId"
            clearable
            placeholder="请选择市区"
            @change="searchForm.districtId = ''; getDistrictList(searchForm.cityId, 'districtOptions')">
            <el-option
              v-for="item in cityOptions"
              :key="item.cityId"
              :label="item.cityName"
              :value="item.cityId">
            </el-option>
        </el-select>
        <el-select
            v-if="searchForm.cityId"
            v-model="searchForm.districtId"
            clearable
            placeholder="请选择县区">
            <el-option
              v-for="item in districtOptions"
              :key="item.districtId"
              :label="item.districtName"
              :value="item.districtId">
            </el-option>
        </el-select>
                        </el-form-item> -->
                    </div>
                    <!-- <div class="index_search_right">
                        <el-form-item label="选择时间">
                            <el-radio v-model="radio" label="1">今日</el-radio>
                            <el-radio v-model="radio" label="2">本周</el-radio>
                            <el-radio v-model="radio" label="3">本月</el-radio>
                            <el-radio v-model="radio" label="4">本年</el-radio>
                        </el-form-item>
                    </div> -->
                </div>
            </el-form>
        </div>
        <div class="echarts">
            <div class="echarts_left">
                <div id="annulus"></div>
            </div>
            <div class="echarts_right">
                <div class="background"></div>
                <div id="brokenLine"></div>
            </div>
        </div>
        <div class="echarts_columnar">
            <div id="columnar"></div>
        </div>
        <div class="index_table">
            <index-table></index-table>
        </div>
    </div>
</template>

<script>
import indexTable from '../../components/index/IndexTable'
// import axios from '@/assets/axios/Index.js'
// import regisAxios from '@/assets/axios/RegistrationManagement.js'
// import levelAxios from '@/assets/axios/EventManagement.js'
// import provinceAxios from '@/assets/axios/Expert.js'
// import echarts from '@/utils/echarts.min.js'
let echarts = require('../../assets/js/echarts');
// import height from '@/mixins/heightMixin.js'
export default {
    // mixins: [height],
    components: {
        indexTable
    },
    data() {
        return {
            searchForm: {
                activityId: '',
                activityLevelId: '',
                // provinceId: '',
                // cityId: '',
                // districtId: '',
            },
            activityList: [],
            levelList: [],
            provinceOptions: [],
            cityOptions: [],
            districtOptions: [],
            AllocList: [],
            brokenLineList: [],
            // 注册用户
            userListDateMap: [],
            // 评审专家地区
            enrollListWithOrderWorkUnAllocProvinceNameMap: [],
            enrollListDateMap: [],
            enrollListProvinceNameMap: [],
            enrollListWithOrderDateMap: [],
            enrollListWithOrderProvinceNameMap: [],
            enrollListWithOrderWorkDateMap: [],
            enrollListWithOrderWorkProvinceNameMap: [],
            enrollListWithOrderWorkUnAllocDateMap: [],
            enrollListWithOrderWorkInScoreDateMap: [],
            enrollListWithOrderWorkInScoreProvinceNameMap: [],
            enrollListWithOrderWorkScoredDateMap: [],
            enrollListWithOrderWorkScoredProvinceNameMap: [],
            enrollListWithOrderWorkScoreUpGradeDateMap: [],
            enrollListWithOrderWorkScoreUpGradeProvinceNameMap: [],
            enrollListWithOrderWorkScoreDownGradeDateMap: [],
            enrollListWithOrderWorkScoreDownGradeProvinceNameMap: [],
            enrollListWithOrderWorkScoreUpGradeCount: 0,
            enrollListWithOrderWorkScoreDownGradeCount: 0,
            enrollListWithOrderWorkCount: 0,
            enrollListWithOrderCount: 0,
            enrollListCount: 0,
        }
    },
    mounted() {
        this.getStatUser()
        this.getStatEnroll()
        // regisAxios.getActivityList()
        // .then(res => {
        //   this.activityList = JSON.parse(JSON.stringify(res.data.result));
        // })
        this.getProvince()
    },
    methods: {
        getStatUser() {
            // axios.getStatUser()
            // .then(res => {
            //     this.userListDateMap = res.data.result.userListDateMap
            //     // this.teacherListProvinceNameMap = res.data.result.teacherListProvinceNameMap
            //     // this.userListCount = res.data.userListCount
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
            //     this.enrollListWithOrderWorkScoreUpGradeCount = Number(res.data.result.enrollListWithOrderWorkScoreUpGradeCount)
            //     this.enrollListWithOrderWorkScoreDownGradeCount = Number(res.data.result.enrollListWithOrderWorkScoreDownGradeCount)
            //     this.enrollListWithOrderWorkCount = Number(res.data.result.enrollListWithOrderWorkCount)
            //     this.enrollListWithOrderCount = Number(res.data.result.enrollListWithOrderCount)
            //     this.enrollListCount = Number(res.data.result.enrollListCount)
            //     this.enrollListDateMap = res.data.result.enrollListDateMap
            //     this.enrollListProvinceNameMap = res.data.result.enrollListProvinceNameMap
            //     this.enrollListWithOrderDateMap = res.data.result.enrollListWithOrderDateMap
            //     this.enrollListWithOrderProvinceNameMap = res.data.result.enrollListWithOrderProvinceNameMap
            //     this.enrollListWithOrderWorkDateMap = res.data.result.enrollListWithOrderWorkDateMap
            //     this.enrollListWithOrderWorkProvinceNameMap = res.data.result.enrollListWithOrderWorkProvinceNameMap
            //     this.enrollListWithOrderWorkUnAllocDateMap = res.data.result.enrollListWithOrderWorkUnAllocDateMap
            //     this.enrollListWithOrderWorkUnAllocProvinceNameMap = res.data.result.enrollListWithOrderWorkUnAllocProvinceNameMap
            //     this.enrollListWithOrderWorkInScoreDateMap = res.data.result.enrollListWithOrderWorkInScoreDateMap
            //     this.enrollListWithOrderWorkInScoreProvinceNameMap = res.data.result.enrollListWithOrderWorkInScoreProvinceNameMap
            //     this.enrollListWithOrderWorkScoredDateMap = res.data.result.enrollListWithOrderWorkScoredDateMap
            //     this.enrollListWithOrderWorkScoredProvinceNameMap = res.data.result.enrollListWithOrderWorkScoredProvinceNameMap
            //     this.enrollListWithOrderWorkScoreUpGradeDateMap = res.data.result.enrollListWithOrderWorkScoreUpGradeDateMap
            //     this.enrollListWithOrderWorkScoreUpGradeProvinceNameMap = res.data.result.enrollListWithOrderWorkScoreUpGradeProvinceNameMap
            //     this.enrollListWithOrderWorkScoreDownGradeDateMap = res.data.result.enrollListWithOrderWorkScoreDownGradeDateMap
            //     this.enrollListWithOrderWorkScoreDownGradeProvinceNameMap = res.data.result.enrollListWithOrderWorkScoreDownGradeProvinceNameMap
            //     this.brokenLineList = this.enrollListDateMap
            //     this.AllocList = this.enrollListProvinceNameMap
                this.getEchartsAnnulus()
                this.getEchartsColumnar()
                this.getEchartsBrokenLine()
            // })
        },
        getEchartsAnnulus() {
            let myChart = echarts.init(document.getElementById('annulus')),
            option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    right: 10,
                    bottom: 40,
                    itemGap: 25,
                    data: ['马富康销售', '李建国销售', '孙志斌销售', '李玉杰销售', '王立杰销售']
                },
                color: ['#ff5722', '#15d385', '#2196f3', '#ffeb3b', '#673ab7'],
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['40%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {value: 22850, name: '马富康销售'},
                        {value: 24590, name: '李建国销售'},
                        {value: 18950, name: '孙志斌销售'},
                        {value: 18794, name: '李玉杰销售'},
                        {value: 19680, name: '王立杰销售'}
                    ]
                }]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        getEchartsBrokenLine() {
            // let XData = [], data = []
            // for(let i in this.brokenLineList) {
            //     XData.push(i)
            // }
            // XData = XData.sort(this.sortDownDate)
            // if (XData.length > 30) XData = XData.slice(-30)
            // for(let i of XData) {
            //     data.push(this.brokenLineList[i])
            // }
            let myChart = echarts.init(document.getElementById('brokenLine')),
            option = {
                tooltip: {
                    formatter: function(params, ticket, callback) {
                        return "日期: " + params.name + "<br/>数量: " + params.data
                    }
                },
                xAxis: {
                    type: 'category',
                    data: ['2020-01', '2020-02', '2020-03', '2020-04', '2020-05', '2020-06', '2020-07', '2020-08', '2020-09'],
                    //坐标轴颜色
                    axisLine:{
                        lineStyle:{
                            color:'#407bed'
                        }
                    },
                    axisLabel:{
                        color:'#808080'
                    }
                },
                yAxis: {
                    type: 'value',
                    //坐标轴颜色
                    axisLine:{
                        lineStyle:{
                            color:'#407bed'
                        }
                    },
                    axisLabel:{
                        color:'#808080'
                    }
                },
                series: [{
                    itemStyle:{
                        normal:{
                            color:'#ff5722',
                            borderColor:'#407bed',  //拐点边框颜色
                        }
                    },
                    data: [5000, 8000, 9400, 6800, 5700, 8900, 15000, 4700, 6700],
                    type: 'line'
                }]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        getEchartsColumnar() {
            // let XData = [], NumData = []
            // for(let item in this.AllocList) {
            //     XData.push(item)
            //     NumData.push(this.AllocList[item])
            // }
            let myChart = echarts.init(document.getElementById('columnar')),
            option = {
                color: ['#7ac0f8'],
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: ['北京市', '吉林省', '四川省', '山东省', '山西省', '广东省', '江苏省', '河南省', '浙江省', '海南省', '黑龙江省', '广西壮族自治区'],
                    //坐标轴颜色
                    axisLine:{
                        lineStyle:{
                            color:'#407bed'
                        }
                    },
                    axisLabel:{
                        formatter:function(value){
                            return value.split("").join("\n")
                        },
                        color:'#808080'
                    }
                },
                yAxis: {
                    type: 'value',
                    // max: 20,
                    //坐标轴颜色
                    axisLine:{
                        lineStyle:{
                            color:'#407bed'
                        }
                    },
                    axisLabel:{
                        color:'#808080'
                    }
                },
                series: [{
                    data: [5000, 2000, 2400, 1800, 5700, 8900, 5000, 4700, 6700, 3000, 2800, 1500],
                    type: 'bar',
                    barWidth : 20,
                    barGap:50
                }],
                tooltip: {
                    // show: true,
                    // trigger: 'axis',
                    // //show: true,   //default true
                    // showDelay: 0,//显示延时，添加显示延时可以避免频繁切换
                    // hideDelay: 50,//隐藏延时
                    // transitionDuration: 0,//动画变换时长
                    // backgroundColor: 'rgba(0,0,0,0.7)',//背景颜色（此时为默认色）
                    // borderRadius: 8,//边框圆角
                    padding: 10,    // [5, 10, 15, 20] 内边距
                    position: function (p) {
                        // 位置回调
                        return [p[0] + 10, p[1] - 10];
                    },
                    formatter(params, ticket, callback) {
                        return "数量: " + params.data;
                        // setTimeout(function () {
                        // //     // 仅为了模拟异步回调
                        //     callback(ticket, res);
                        // }, 10)
                        // return '请等候...';
                    }
                },
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        sortDownDate(a, b) {
            return Date.parse(a) - Date.parse(b);
        },
        sortUpDate(a, b) {
            return Date.parse(b) - Date.parse(a);
        },
        //获取省份
        getProvince() {
            // provinceAxios.getProvinceList()
            // .then(res => {
            //     this.provinceOptions = res.data.result;
            // })
        },
        // 获取市区列表
        getCityList(val, name) {
            if(!val) return
            // provinceAxios.getCityList(val)
            // .then(res => {
            //     this[name] = res.data.result
            // })
        },
        // 获取县区列表
        getDistrictList(val, name) {
            if(!val) return
            // provinceAxios.getDistrictList(val)
            // .then(res => {
            //     this[name] = res.data.result
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
    }
}
</script>

<style lang="scss" scoped>

.main {
    padding-top: 0px!important;
}
.index {
    overflow: auto;
}
.index_search {
    height: auto;
    width: 100%;
    background-color: white;
    .el-form {
        height: auto;
        .search_content {
            display: flex;
            .index_search_left {
                margin-top: 20px;
                margin-left: 20px;
                width: 50%;
            }
            .index_search_right {
                width: 50%;
                margin-top: 20px;
            }
            .active_select {
                width: auto;
            }
        }
    }
}
.echarts {
    height: auto;
    width: 100%;
    margin-top: 20px;
    display: flex;
    // justify-content: space-around;
    align-items: center;
    .echarts_left {
        width: 30%;
        background-color: white;
        height: 380px;
        .el-form {
            margin-top: 20px;
            margin-left: 30px;
        }
        #annulus {
            width: 100%;
            height: 300px
        }
    }
    .echarts_right {
        // margin-left: 20px;
        background-color: white;
        width: 70%;
        height: 380px;
        display: flex;
        .background {
            width: 20px;
            height: 100%;
            background-color: #eee;;
        }
        #brokenLine {
            width: 100%;
            height: 370px
        }
    }
}
.echarts_columnar {
    height: 400px;
    width: 100%;
    margin-top: 20px;
    background-color: white;
    #columnar {
        width: 100%;
        height: 400px;
    }
}
.index_table {
    width: 100%;
    margin-top: 20px;
    background-color: white;
}

span {
    padding: 0px;
    color: #495A80;
}
.table_title {
    margin: 20px;
    font-size: 25px;
}
</style>

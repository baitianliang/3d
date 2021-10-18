<template>
    <div id="realTime">
        <visualTitle :title="location + '工作面实时数据'"></visualTitle>
        <div class="data-wrapper">
            <div ref="realTime" style="width: 100%;height: 100%"></div>
        </div>
    </div>
</template>

<script>
    import visualTitle from '../common/visualTitle'

    // 工作面实时数据
    export default {
        name: "realTime",
        components: {
            visualTitle
        },
        data() {
            return {
                realTime: '',
                option: {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        textStyle: {
                            color: '#fff',
                        },
                        top: '50%',
                        right: 7,
                        data: ['实时数据', '平均值',],
                    },
                    grid: {
                        left: '3%',
                        right: '12%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: true,
                            axisLine: {       //y轴
                                show: false
                            },
                            axisLabel: {
                                color: '#fff',
                                interval: 0,
                            },
                            data: []
                        }
                    ],
                    yAxis: [
                        {
                            name: '(Mpa)',
                            nameLocation: 'end',
                            min: 20,
                            max: 40,
                            nameTextStyle: {
                                color: '#fff',
                                fontSize: 12,
                            },
                            type: 'value',
                            axisLine: {       //y轴
                                show: false,
                                // 分割线设置
                            },
                            axisLabel: {
                                color: '#fff',
                            },
                            splitLine: {
                                show: true,  //显示分割线
                                lineStyle: {
                                    color: ['#1A2C3C']
                                }
                            },

                            // scale: true,/*按比例显示*/
                        }
                    ],
                    series: [
                        {
                            name: '实时数据',
                            type: 'line',
                            // areaStyle: {},
                            data: [],
                            symbolSize: 8,
                            animationDuration: 1000,
                            animationDurationUpdate: 500,
                            itemStyle: {
                                normal: {
                                    // areaStyle: {type: 'default'},
                                    // color: new this.$echarts.graphic.LinearGradient(
                                    //     0, 0, 0, 1,
                                    //     [
                                    //         {offset: 0, color: '#4465f3'},
                                    //         {offset: 0.5, color: 'rgba(68,101,243, 0.3)'},
                                    //         {offset: 1, color: 'rgba(68,101,243, 0)'}
                                    //     ]
                                    // ),
                                    color: '#1bc85e',
                                    borderColor: '#fff',//拐点边框颜色
                                    borderWidth: 1,//拐点边框大小
                                },
                            },
                        },
                        {
                            name: '平均值',
                            type: 'line',
                            // areaStyle: {},
                            data: [],
                            symbolSize: 8,
                            itemStyle: {
                                normal: {
                                    // areaStyle: {type: 'default'},
                                    // color: new this.$echarts.graphic.LinearGradient(
                                    //     0, 0, 0, 1,
                                    //     [
                                    //         {offset: 0, color: '#f3447a'},
                                    //         {offset: 0.5, color: 'rgba(243,68,122, 0.3)'},
                                    //         {offset: 1, color: 'rgba(243,68,122, 0.1)'}
                                    //     ]
                                    // ),
                                    color: '#eadc00',
                                    borderColor: '#fff',//拐点边框颜色
                                    borderWidth: 1,//拐点边框大小

                                },

                            },
                        },
                    ]
                },
                location: '',
            }
        },
        methods: {
            echartsInit() {
                let realTime = this.$echarts.init(this.$refs.realTime);
                window.addEventListener('resize',function(){
                    realTime.resize();
                })

                this.setRealTime(realTime);
            },
            setRealTime(realTime) {
                realTime.setOption(this.option);
            },
            getData(location) {
                this.location = location;
                this.axios({
                    url: this.$host + '/pressure_data/now',
                    method: 'get',
                    params: {
                        page: 1,
                        rows_pre_page: 9,
                        location_data: location,
                    }
                }).then(res => {
                    if (res.data.data.content.length > 0){
                        this.scraper = JSON.parse(JSON.stringify(res.data.data.content));
                        let x = [];
                        let maxData = [];
                        let realData = [];
                        this.scraper.forEach(data => {
                            data.collectionTime = data.collectionTime.substr(11, 5);
                            // data.collectionTime = data.collectionTime.substr(5, 11);
                            x.push(data.collectionTime);
                            maxData.push(data.maxData);
                            realData.push(data.realData);
                        })
                        this.option.xAxis[0].data = x;
                        this.option.series[0].data = maxData;
                        this.option.series[1].data = realData;
                        this.echartsInit();
                    }
                })
            },
        },
        mounted() {

        },

    }
</script>

<style scoped>
    .data-wrapper{
        height: 312px;
    }
</style>

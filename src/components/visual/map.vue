<template>
    <div id="maps">
        <div id="map" ref="map"></div>
        <div id="back" @click="back()" v-if="option.geo.map !== 'china'"></div>
    </div>
</template>

<script>
    import qs from 'qs'
    import 'echarts/map/js/china'
    import 'echarts/map/js/province/anhui'
    import 'echarts/map/js/province/aomen'
    import 'echarts/map/js/province/beijing'
    // import 'echarts/map/js/province/chongqing'
    import '../../assets/map/chongqing'
    import 'echarts/map/js/province/fujian'
    // import 'echarts/map/js/province/gansu'
    import '../../assets/map/gansu'
    import 'echarts/map/js/province/guangdong'
    import 'echarts/map/js/province/guangxi'
    import 'echarts/map/js/province/hainan'
    import 'echarts/map/js/province/hebei'
    import 'echarts/map/js/province/heilongjiang'
    import 'echarts/map/js/province/henan'
    import 'echarts/map/js/province/hubei'
    import 'echarts/map/js/province/hunan'
    import 'echarts/map/js/province/jiangsu'
    import 'echarts/map/js/province/jiangxi'
    import 'echarts/map/js/province/jilin'
    import 'echarts/map/js/province/liaoning'
    import 'echarts/map/js/province/neimenggu'
    import 'echarts/map/js/province/ningxia'
    import 'echarts/map/js/province/qinghai'
    import 'echarts/map/js/province/shanghai'
    import 'echarts/map/js/province/shanxi'
    import 'echarts/map/js/province/shanxi1'
    import 'echarts/map/js/province/sichuan'
    import 'echarts/map/js/province/taiwan'
    // import 'echarts/map/js/province/tianjin'
    import '../../assets/map/tianjin'
    import 'echarts/map/js/province/xianggang'
    import 'echarts/map/js/province/xizang'
    import 'echarts/map/js/province/yunnan'
    import 'echarts/map/js/province/zhejiang'
    import 'echarts/map/js/province/guizhou'
    import 'echarts/map/js/province/xinjiang'
    import 'echarts/map/js/province/shandong'

    export default {
        name: "maps",
        data() {
            return {
                tag: [],
                option: {
                    geo: {
                        map: 'china',
                        aspectScale: 1, // 地图倾斜度
                        zoom: 1,
                        label: { //图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等
                            normal: {
                                show: false,
                                textStyle: {
                                    color: "rgb(255,255,255,0)", //正常状态的样式
                                    fontSize: "12"
                                }
                            },
                            emphasis: {
                                show: false,
                                // textStyle: {
                                //   color: "#f00", //被选中的样式
                                //   fontSize: "12"
                                // }
                            }
                        },
                        itemStyle: {
                            normal: {
                                // backgroundColor: 'rgba(255,150,128,1)',
                                areaColor: 'rgba(255,255,255,0)',//区域背景色
                                borderWidth: 1,
                                borderColor: 'rgb(29,140,228)',
                            },
                            emphasis: {
                                backgroundColor: 'rgba(255,150,128,1)',
                                areaColor: 'rgba(29,140,228,.5)'
                            },
                        },
                        emphasis: {
                            itemStyle: {
                                areaColor: null,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowBlur: 20,
                                borderWidth: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                    },
                    tooltip: { //标注点tooltip
                        show: true,
                        trigger: 'item',
                        transitionDuration: 0,
                        position: 'top',
                        padding: 5,
                        textStyle: {
                            fontSize: 20,
                        },
                        backgroundColor: 'rgba(9,28,39,.7)',
                        formatter: function (params) {
                            let res = '';
                            if (params.data.locationParent === 0) {
                                res = params.data.name
                            } else {
                                if( params.data.content.substr(0,4) === 'http'){
                                    res = '<img src="' + params.data.content + '" style="width: auto;height: 96px" />'
                                }else{
                                    res = params.data.content
                                }

                            }
                            return res
                        }
                    },
                    series: [
                        {
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            // showEffectOn: 'render',
                            // rippleEffect: {
                            //     brushType: 'stroke'
                            // },
                            // hoverAnimation: true,
                            // legendHoverLink: true,
                            data: [],
                            symbolSize: [8, 8],
                            itemStyle: {
                                color: '#ff5400',
                            },
                            emphasis: {
                                label: {
                                    show: false
                                }
                            },

                        },
                    ],
                },
                isWarning: true,
                imgShow: false,
                imgTimeInterval: null,//闪烁计时器
                socket: '',
                warningList: [],
                source: null,
            }
        },
        methods: {
            cancelQuest(){
                if(typeof this.source === 'function'){
                    this.source('取消请求'); //取消请求
                }
            },
            getData() {
                this.axios({
                    url: this.$host + '/location/list?page=1&rows_pre_page=99999',
                    method: 'get',
                    params: {
                        parentId: 0
                    }
                }).then(res => {
                    this.tag = JSON.parse(JSON.stringify(res.data.data));
                    this.echartsInit();
                })
            },
            echartsInit() {
                let map = this.$echarts.init(this.$refs.map);
                window.addEventListener('resize', function () {
                    map.resize();
                });
                this.setMap(map);
            },
            setMap(map) {
                let nowData = [];
                if (this.option.geo.map === 'china') {
                    this.$emit('getLoactionId',0,false);
                    this.option.series[0].data = [];
                    nowData = this.tag;
                    this.cancelQuest();
                    let timeout = setTimeout(() => {
                        this.option.series[0].data = nowData;
                        map.setOption(this.option);
                        clearTimeout(timeout)
                    }, 300)
                } else {
                    this.tag.forEach(data => {
                        if (data.province === this.option.geo.map) {
                            let jl = false;
                            let timeout = setTimeout(() => {
                                map.setOption(this.option);
                                jl = true;
                                clearTimeout(timeout)
                            }, 300);
                            this.$emit('getLoactionId',data.locationId,false);
                            let _this = this;
                            this.cancelQuest();
                            this.axios({
                                url: this.$host + '/location/list',
                                method: 'get',
                                cancelToken: new this.axios.CancelToken((c)=>{
                                   _this.source = c;
                                }),
                                params: {
                                    page: 1,
                                    rows_pre_page: 99999,
                                    parentId: data.locationId
                                },
                            }).then(res => {
                                nowData = res.data.data;
                                // if (data.locationId === 17){
                                //     nowData[1].value[1] = parseFloat(nowData[0].value[1]) + 0.15
                                // }
                                this.option.series[0].data = nowData;
                                if (jl === true) {
                                    map.setOption(this.option);
                                }
                            })
                        }
                    });
                }
                map.setOption(this.option);
                let that = this;
                map.off("click");
                map.on('click', function (params) {
                    if (params.componentType === 'geo') {
                        if (params.name === '北京' || params.name === '上海' || params.name === '天津' || params.name === '重庆' || params.name === '河北' || params.name === '山西' || params.name === '内蒙古' || params.name === '辽宁' || params.name === '吉林' || params.name === '黑龙江' || params.name === '山东' || params.name === '江苏' || params.name === '安徽' || params.name === '浙江' || params.name === '江西' || params.name === '福建' || params.name === '河南' || params.name === '湖北' || params.name === '湖南' || params.name === '广东' || params.name === '广西' || params.name === '海南' || params.name === '四川' || params.name === '云南' || params.name === '贵州' || params.name === '陕西' || params.name === '甘肃' || params.name === '青海' || params.name === '宁夏' || params.name === '新疆' || params.name === '西藏' || params.name === '台湾' || params.name === '香港') {
                            that.option.geo.map = params.name;
                            that.option.series[0].data = [];
                            that.setMap(map);
                        }
                    }else {
                        if (params.data.locationParent !== 0){
                            // that.$emit('getLoactionId',params.data.locationId,true);
                            that.$emit('getLoactionId', params.data.locationId ,'all',params.name);

                            // that.$router.push({
                            //     path:'/tunnel',
                            //     query:{
                            //         locationId: params.data.locationId
                            //     }
                            // })
                        }
                    }
                })
            },
            //返回中国地图
            back() {
                let map = this.$echarts.getInstanceByDom(this.$refs.map);
                this.option.geo.map = 'china';
                this.setMap(map);
                this.$emit('getLoactionId', 0 ,'all');
            },
        },
        mounted() {
            this.getData();
        },
        beforeDestroy() {
            this.$echarts.init(this.$refs.map).clear()
        },
        destroyed() {
            this.clearInterval();
            this.socket.close()
        }
    }
</script>

<style lang="scss" scoped>
    #maps {
        height: 636px;
    }

    #map {
        width: 100%;
        height: calc(100% - 50px);
        position: relative;
        top: 50px;
    }

    #back {
        width: 40px;
        height: 40px;
        font-size: 14px;
        text-align: center;
        line-height: 50px;
        border-radius: 50%;
        position: absolute;
        top: 50px;
        right: 50px;
        background-image: url("../../assets/img/chinaBack.png");
        background-position: 50% 6%;
        background-repeat: no-repeat;
        cursor: pointer;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }
</style>

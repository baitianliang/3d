<template>
    <div id="map3D">
        <div class="map" id="china" ref="map" v-show="isChina"></div>
        <transition name="scale">
            <div class="map" id="province" ref="provinceMap" v-show="isProvince"></div>
        </transition>
        <div class="back" v-show="isProvince" @click="backChina"></div>
    </div>
</template>

<script>
    import "../../assets/js/echarts-gl.min";
    import "echarts/map/js/china";
    import "echarts/map/js/province/anhui";
    import "echarts/map/js/province/aomen";
    import "echarts/map/js/province/beijing";
    import "echarts/map/js/province/chongqing";
    import "echarts/map/js/province/fujian";
    import "echarts/map/js/province/gansu";
    import "echarts/map/js/province/guangdong";
    import "echarts/map/js/province/guangxi";
    import "echarts/map/js/province/hainan";
    import "echarts/map/js/province/hebei";
    import "echarts/map/js/province/heilongjiang";
    import "echarts/map/js/province/henan";
    import "echarts/map/js/province/hubei";
    import "echarts/map/js/province/hunan";
    import "echarts/map/js/province/jiangsu";
    import "echarts/map/js/province/jiangxi";
    import "echarts/map/js/province/jilin";
    import "echarts/map/js/province/liaoning";
    import "echarts/map/js/province/neimenggu";
    import "echarts/map/js/province/ningxia";
    import "echarts/map/js/province/qinghai";
    import "echarts/map/js/province/shanghai";
    import "echarts/map/js/province/shanxi";
    import "echarts/map/js/province/shanxi1";
    import "echarts/map/js/province/sichuan";
    import "echarts/map/js/province/taiwan";
    import "echarts/map/js/province/tianjin";
    import "echarts/map/js/province/xianggang";
    import "echarts/map/js/province/xizang";
    import "echarts/map/js/province/yunnan";
    import "echarts/map/js/province/zhejiang";
    import "echarts/map/js/province/guizhou";
    import "echarts/map/js/province/xinjiang";
    import "echarts/map/js/province/shandong";
    require
    // import mark from '../assets/img/mark1.png'
    import mapBg from '../../assets/img/mapbg1.jpg'
    // let markBase64 = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAaCAMAAACNQ/wIAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAABa1BMVEX/VVX/VVX/VVX/VVX/ VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/ VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/ VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/ VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/ VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/ VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/VVX/ VVX/VVX///8X7wcoAAAAd3RSTlMAAh1mo83h4s6laB4ZYqrZ+frarGQcIYrq7I4lFJr9oBcKgvLU pKLS/vWICzzM+7xLIEi20EKG7Uff8MH8yg4Nw8ciH8ttEevkejMxd+D46c/oc+d8L8g0CIvzkLq9 eX+pTdjcUhV7gBi+Pglx5XgTnBYtsDUGdaqnUCAAAAABYktHRHjW2+RGAAAACXBIWXMAAAsTAAAL EwEAmpwYAAAAB3RJTUUH5AkLAhwH4IcK1AAAAR5JREFUGNNVkGdbwkAQhAdBwJ6gRiGKogKxIGhE rGAXUFFUFLFg773d3/c2CZLMh9u59/bu9hkAsNXYHbVOl7uuvsEGXY1NzS0CY6Knta1dJ1JHJzPk 9clEurr9tBMEWv09vUCgr5/8QDAUVngdHBrGSISb0WhMGhtXRW4n4phM8OqK0RNT09zO+DA7x+t8 klBqgVtlEXTCwkuEllfIO+GlklhdA5L2dW0QvUtJZ7Ibm1uK3qXmtCG3d9x5zYhR7KaZRXv7KBxY UeQQxaOSmZSOi0DhxIxOs5TWmaktV9YSk4JVdC7rgV1cVsjVtZHqzW0F3d0bCLLxw4OMfz16tGvx KsHT8wtj+deACeHtXVRCH7Do80v9thL8/GZShv0Deft2PA6xKpQAAAAldEVYdGRhdGU6Y3JlYXRl ADIwMjAtMDktMTFUMDI6Mjg6MDcrMDA6MDAVUdMNAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTA5 LTExVDAyOjI4OjA3KzAwOjAwZAxrsQAAAABJRU5ErkJggg==';
    export default {
        name: "maps",
        data() {
            return {
                tag: [],
                provinceData: [],
                option: {
                    geo3D: {
                        map: "china",
                        boxHeight: 20,
                        regionHeight: 2.5, // 地图厚度
                        itemStyle: {
                            color: "rgba(101,203,337,1)",
                            areaColor: "rgba(101,203,337,1)",
                            borderWidth: 1,
                            borderColor: "rgba(101,203,337,1)",
                        },
                        viewControl: {
                            distance: 90,
                            panSensitivity: 0,
                            zoomSensitivity: 0,
                            rotateSensitivity: 0,
                            alpha: 35,
                        },
                        emphasis: {
                            label: {
                                show: false,
                            },
                            itemStyle: {
                                areaColor: "rgba(101,203,337,1)",
                            },
                        },
                        label: {
                            show: false,
                        },
                        shading: 'realistic',
                        // shading: "lambert",
                        // shading: 'color',
                        realisticMaterial: {
                            detailTexture: mapBg,
                            // textureOffset: 20
                        },

                        animation: true,
                    },
                    tooltip: {
                        //标注点tooltip
                        show: true,
                        trigger: "item",
                        transitionDuration: 0,
                        position: "top",
                        padding: 5,
                        textStyle: {
                            fontSize: 20,
                        },
                        formatter: function (params) {
                            let res = "";
                            if (params.data.locationParent === 0) {
                                res = params.data.name;
                            } else {
                                if (params.data.content.substr(0, 4) === "http") {
                                    res =
                                        '<img src="' +
                                        params.data.content +
                                        '" style="width: auto;height: 96px" />';
                                } else {
                                    res = params.data.content;
                                }
                            }
                            return res;
                        },
                    },
                    series: [
                        {
                            type: "scatter3D",
                            coordinateSystem: "geo3D",
                            data: [],
                            // symbol: "circle",
                            symbol: "pin",
                            symbolSize: 15,
                            // symbol: markBase64,
                            label: {
                                show: false,
                            },
                            emphasis: {
                                label: {
                                    show: false,
                                },
                            },
                            itemStyle: {
                                opacity: 1,
                            },
                            animation: false,
                        }
                    ],
                },
                provinceOption: {
                    geo3D: {
                        map: "china",
                        // roam: true,
                        boxHeight: 20,
                        // boxDepth: 70, // 地图倾斜度
                        regionHeight: 3, // 地图厚度
                        itemStyle: {
                            color: "rgba(101,203,337,1)",
                            // opacity: 1,
                            areaColor: "rgba(101,203,337,1)",
                            borderWidth: 1,
                            borderColor: "rgba(101,203,337,1)",
                        },
                        viewControl: {
                            distance: 100,
                            panSensitivity: 0,
                            zoomSensitivity: 0,
                            rotateSensitivity: 0,
                            alpha: 35,
                        },
                        emphasis: {
                            label: {
                                show: false,
                            },
                            itemStyle: {
                                // areaColor: null,
                                areaColor: "rgba(101,203,337,1)",
                            },
                        },
                        label: {
                            show: false,
                        },
                        shading: 'realistic',
                        // shading: "lambert",
                        // shading: 'color',
                        realisticMaterial: {
                            detailTexture: mapBg,
                            // textureOffset: 20
                        },
                        animation: true,
                    },
                    tooltip: {
                        //标注点tooltip
                        show: true,
                        trigger: "item",
                        transitionDuration: 0,
                        position: "top",
                        padding: 5,
                        textStyle: {
                            fontSize: 20,
                        },
                        formatter: function (params) {
                            let res = "";
                            if (params.data.locationParent === 0) {
                                res = params.data.name;
                            } else {
                                if (params.data.content.substr(0, 4) === "http") {
                                    res =
                                        '<img src="' +
                                        params.data.content +
                                        '" style="width: auto;height: 0.2rem" />';
                                } else {
                                    res = params.data.content;
                                }
                            }
                            return res;
                        },
                    },
                    series: [
                        {
                            geo3DIndex: 10,
                            type: "scatter3D",
                            coordinateSystem: "geo3D",
                            opacity: 1,
                            data: [],
                            // symbol: "circle",
                            symbol: "pin",
                            symbolSize: 15,
                            // symbol: 'image://' + mark,
                            // symbol: markBase64,
                            label: {
                                show: false,
                            },
                            emphasis: {
                                label: {
                                    show: false,
                                },
                            },
                            itemStyle: {
                                opacity: 1,
                            },
                            animation: false,
                        }
                    ],
                },
                areaList: [],
                isChina: true,
                isProvince:false,
            };
        },
        methods: {
            getChinaData() {
                this.axios({
                    url: this.$host + "/location/list?page=1&rows_pre_page=99999",
                    method: "get",
                    params: {
                        parentId: 0,
                    },
                }).then((res) => {
                    this.tag = JSON.parse(JSON.stringify(res.data.data));
                    this.areaList = [];
                    this.tag.forEach((data) => {
                        data.value.push(2);
                        this.areaList.push(data.province);
                    });
                    this.tag.push({
                        name: '最低点',
                        value: [0, 0, 1]
                    });
                    this.tag.push({
                        name: '最高点',
                        value: [0, 0, 20]
                    });
                    this.option.series[0].data = this.tag;
                    this.chinaInit();
                });
            },
            chinaInit() {
                let map = this.$echarts.init(this.$refs.map);
                map.setOption(this.option);
                map.off("click");
                let that = this;
                map.on("click", (params) => {
                    if (params.seriesType !== 'scatter3D') {
                        if (that.areaList.indexOf(params.name) !== -1) {
                            that.provinceOption.geo3D.map = params.name;
                            let provinceMap = this.$echarts.getInstanceByDom(this.$refs.provinceMap);
                            provinceMap.setOption(this.provinceOption);
                            let map = this.$echarts.getInstanceByDom(this.$refs.map);
                            // map.dispose();
                            map.clear();
                            that.tag.forEach((data) => {
                                if (data.province === params.name) {
                                    if(params.name ===  '山西' || params.name ===  '陕西'){
                                        this.provinceOption.geo3D.viewControl.distance = 230
                                    }else if(params.name ===  '黑龙江'){
                                        this.provinceOption.geo3D.viewControl.distance = 130
                                    }else if(params.name ===  '北京' || params.name ===  '江苏'||params.name ===  '河南'||params.name ===  '四川'||params.name ===  '辽宁'||params.name ===  '重庆'||params.name ===  '贵州'){
                                        this.provinceOption.geo3D.viewControl.distance = 140
                                    }else if(params.name ===  '云南'){
                                        this.provinceOption.geo3D.viewControl.distance = 150
                                    }else if(params.name ===  '湖南'){
                                        this.provinceOption.geo3D.viewControl.distance = 160
                                    }else{
                                        this.provinceOption.geo3D.viewControl.distance = 100
                                    }
                                    that.provinceInit(data.locationId);
                                }
                            });
                        }
                    }
                });
            },

            provinceInit(id) {
                this.isChina = false;
                this.isProvince = true;
                let provinceMap = this.$echarts.init(this.$refs.provinceMap);
                this.getProvinceData(id);
                let that = this;
                provinceMap.off("click");
                provinceMap.on("click", (params) => {
                    if (params.seriesType === 'scatter3D') {
                        that.$emit('getLoactionId', params.data.locationId ,'all',params.name);
                    }
                });
            },
            getProvinceData(id) {
                this.$emit('getLoactionId',id,false);
                this.axios({
                    url: this.$host + "/location/list",
                    method: "get",
                    params: {
                        page: 1,
                        rows_pre_page: 99999,
                        parentId: id,
                    },
                }).then((res) => {
                    let nowData = JSON.parse(JSON.stringify(res.data.data));
                    nowData.forEach(data => {
                        data.value.push(2)
                    });
                    nowData.push({
                        name: '最低点',
                        value: [0, 0, 1]
                    });
                    nowData.push({
                        name: '最高点',
                        value: [0, 0, 20]
                    });
                    this.provinceOption.series[0].data = nowData;
                    let provinceMap = this.$echarts.getInstanceByDom(this.$refs.provinceMap);
                    provinceMap.setOption(this.provinceOption);
                });
            },

            backChina() {
                let provinceMap = this.$echarts.getInstanceByDom(this.$refs.provinceMap);
                this.isProvince = false;
                this.$emit('getLoactionId', 0 ,'all');
                setTimeout(()=>{
                    this.chinaInit();
                },300);
                setTimeout(()=>{
                    this.isChina = true;
                    // provinceMap.dispose();
                    provinceMap.clear();
                },400)
            },
        },
        mounted() {
            this.getChinaData();
            let provinceMap = this.$echarts.init(this.$refs.provinceMap);
            provinceMap.setOption(this.provinceOption);
        },
    };
</script>

<style scoped lang="scss">
    #map3D{
        width: 920px;
        height: 636px;
    }
    .map {
        width: 920px;
        height: 586px;
        position: relative;
        top: 50px;
    }

    .back {
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

    .scale-enter,
    .scale-leave-to{
        transform: scale(0);
    }
    .scale-enter-active{
        transition: all 1s ease;
    }
    .scale-leave-active {
        transition: all 0.5s ease;
    }
</style>

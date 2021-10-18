<template>
    <div class="tunnel bg">
        <div id="tunnel" ref="tunnel">
            <visualNav class="tunnelNav" :index="1"></visualNav>
            <div class="search">
                <el-autocomplete
                        class="inline-input"
                        v-model="search"
                        :popper-append-to-body="false"
                        :fetch-suggestions="querySearch"
                        popper-class="dropdownPopper"
                        placeholder="请输入关键字进行搜索"
                        :trigger-on-focus="false"
                        @select="searchClick"
                >
                    <i slot="suffix" class="el-icon-search"></i>
                    <template slot-scope="{item}">
                        <div class="name">{{ item.name}}</div>
                    </template>
                </el-autocomplete>
            </div>
            <unity
                    :hideFooter="true"
                    style="width: 1920px;height: 1080px"
                    src="/3D/Build/SingleV1.7.json"
                    unityLoader="/3D/Build/UnityLoader.js"
                    ref="unityPlan"
            ></unity>
            <div class="rightSidebar" ref="sidebar">
                <components :is="tabs" :userInfo="userDetile" :EQPInfo="EQPDetile" :sum="sum"></components>
            </div>
        </div>
        <div class="loading" v-if="isLoading">
            <div class="loader"></div>
        </div>
    </div>
</template>

<script>
    import Unity from 'vue-unity-webgl'
    import visualNav from '../components/common/visualNav'
    import vEquipment from '../components/tunnel/equipment'
    import vStatistics from '../components/tunnel/statistics'
    import vPeople from '../components/tunnel/people'

    export default {
        name: "tunnel",
        data() {
            return {
                search: '',
                searchList: [],
                tabs: 'vStatistics',
                show: true,
                gameInstance: null,
                refreshTimeInterval: null,
                isLoading: true,
                resData: [],
                userDetile: {},
                EQPDetile: {},
                sum: 0,
            }
        },
        components: {
            Unity,
            visualNav,
            vEquipment,
            vStatistics,
            vPeople,
        },
        methods: {
            target() {
                if (this.show) {
                    this.$refs.sidebar.style.width = '0px';
                } else {
                    this.$refs.sidebar.style.width = '460px';
                    // this.$refs.sidebar.style.width = '1.04167rem';
                }
                this.show = !this.show

            },
            getStatistics() {
                this.tabs = 'vStatistics';
                // alert('获取到了统计数据')
            },
            getUserInfo(data) {
                this.axios({
                    url: this.$host + '/td/getUserInfo',
                    method: 'get',
                    params: {
                        userId: data
                    }
                }).then(res => {
                    this.userDetile = res.data;
                })
                this.tabs = 'vPeople';
            },
            getEQPInfo(data) {
                this.axios({
                    url: this.$host + '/td/getDeviceInfo',
                    method: 'get',
                    params: {
                        deviceId: data
                    }
                }).then(res => {
                    this.EQPDetile = res.data;
                })
                this.tabs = 'vEquipment';
            },
            querySearch(queryString, cb) {
                let restaurants = this.searchList;
                let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
                };
            },
            //获取初始化资源
            getData() {
                this.axios({
                    url: this.$host + '/td/initBasicData',
                    method: 'get'
                }).then(res => {
                    this.$refs.unityPlan.message('JSInterface', 'initBasicData', JSON.stringify(res.data));
                    this.refreshRes();
                    this.$refs.unityPlan.message('JSInterface', 'setViewScroll', 0.5)
                })
            },
            //获取资源
            refreshRes() {
                this.axios({
                    url: this.$host + '/td/refreshRes',
                    method: 'get'
                }).then(res => {
                    this.resData = JSON.parse(JSON.stringify(res.data));
                    this.$refs.unityPlan.message('JSInterface', 'refreshRes', JSON.stringify(res.data))
                    this.sum = 0;
                    this.searchList = [];
                    this.resData.entity.forEach(item => {
                        if (item.t_eCode === 'PersonImage') {
                            this.sum += 1;
                            this.searchList.push({
                                id: item.id,
                                name: item.name,
                                t_eCode: item.t_eCode
                            })
                        } else if (item.t_eCode === 'LocalizerImage') {
                            this.searchList.push({
                                id: item.id,
                                name: item.data[0].value,
                                t_eCode: item.t_eCode
                            })
                        }

                    })
                })
            },
            //每3s调用一次资源信息
            timeOut() {
                this.refreshTimeInterval = setInterval(() => {
                    this.refreshRes();
                }, 3000)
            },
            //搜索
            searchClick(item) {
                let data = {
                    resId: item.id,
                    t_eCode: item.t_eCode
                };
                this.$refs.unityPlan.message('JSInterface', 'setDominantRes', JSON.stringify(data))
            },
            //3d初始化完成
            initFinished() {
                this.isLoading = false;
                this.getData();
                this.timeOut();
            },
            sendAllLine(data) {
                // data
            },
            //选择当前资源
            selectCurrentRes(data) {
                data = JSON.parse(data);
                this.resData.entity.forEach(item => {
                    if (item.id === data.resId) {
                        if (item.t_eCode === 'PersonImage') {
                            // alert('人')
                            this.getUserInfo(item.id);
                        } else if (item.t_eCode === 'LocalizerImage') {
                            // alert('设备')
                            this.getEQPInfo(item.id)
                        }
                    }
                });
            },
            selectCurrentArea(data) {
            },
            unSelectRes() {
                this.getStatistics();
            },
            getResolutions() {
                let width = screen.width;
                let height = screen.height;
                let left = width / 1920;
                let top = height / 1080;
                if (width / height === 1920 / 1080) {
                    this.$refs.tunnel.style.transform = `scale(${left},${top})`;
                } else if (width / height > 1920 / 1080) {
                    this.$refs.tunnel.style.transform = `scale(${top},${top})`;
                } else if (width / height < 1920 / 1080) {
                    this.$refs.tunnel.style.transform = `scale(${left},${left})`;
                }
            },
        },
        mounted() {
            this.getResolutions();
            clearInterval(this.refreshTimeInterval);
            let vm = this;
            window.initFinished = () => {
                vm.initFinished();
            };
            window.sendAllLine = (data) => {
                vm.sendAllLine(data)
            };
            window.selectCurrentRes = (data) => {
                vm.selectCurrentRes(data)
            };
            window.selectCurrentArea = (data) => {
                vm.selectCurrentArea(data)
            };
            window.unSelectRes = (data) => {
                vm.unSelectRes(data)
            };
        },
        created() {
        },
        destroyed() {
            delete window.initFinished;
            delete window.sendAllLine;
            delete window.selectCurrentRes;
            delete window.selectCurrentArea;
            delete window.unSelectRes;
            clearInterval(this.refreshTimeInterval)
        },
    }
</script>

<style lang="scss" scoped>
    .bg {
        background-image: url("../assets/img/bg.jpg");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-attachment: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #tunnel {
        position: relative;
        width: 1920px;
        height: 1080px;

        .tunnelNav {
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 3;
        }

        .search {
            font-size: 38px;
            font-weight: bold;
            color: #FFFFFF;
            position: absolute;
            top: 90px;
            left: 80px;
            background-color: transparent;
            width: 400px;
            height: 100px;
            z-index: 2;

            .el-autocomplete {
                width: 300px;
                height: 35px;
                border-radius: 17px;
                box-sizing: content-box;
            }
        }

        .rightSidebar {
            overflow: hidden;
            padding-top: 62px;
            position: absolute;
            top: 0;
            right: 0;
            z-index: 2;

            > div {
                padding-right: 15px;
                color: #FFFFFF;
            }
        }


    }
    .loading {
        background-color: rgba(0, 0, 0, 0.8);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 4;

        .loader {
            font-size: 12px;
            width: 1em;
            height: 1em;
            border-radius: 50%;
            position: relative;
            top: calc(50% - 6px);
            left: calc(50% - 6px);
            text-indent: -9999em;
            animation: load-effect 1s infinite linear;
        }

        @keyframes load-effect {
            0% {
                box-shadow: -3em 2em 0 .5em #2490fe, 0 2em 0 0 #2490fe, 3em 2em 0 -.5em #2490fe;
            }
            25% {
                box-shadow: -3em 2em 0 0 #2490fe, 0 2em 0 .5em #2490fe, 3em 2em 0 0 #2490fe;
            }
            50% {
                box-shadow: -3em 2em 0 -0.5em #2490fe, 0 2em 0 0 #2490fe, 3em 2em 0 .5em #2490fe;
            }
            75% {
                box-shadow: -3em 2em 0 0 #2490fe, 0 2em 0 -.5em #2490fe, 3em 2em 0 0 #2490fe;
            }
            100% {
                box-shadow: -3em 2em 0 .5em #2490fe, 0 2em 0 0 #2490fe, 3em 2em 0 -.5em #2490fe;
            }
        }
    }
</style>

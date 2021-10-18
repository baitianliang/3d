<template>
    <div id="intact">
        <visualTitle title="矿山设备完好率"></visualTitle>
        <div class="data-wrapper">
            <div class="intact">
                <div class="dept" v-for="(item,index) in intact" :key="index">
                    <div>
                        <div>{{index + 1}}</div>
                        <div>{{item.deviceTypeName}}</div>
                        <div class="progress">
                            <div :style="'width:' + item.intact * 2 + 'px'">
                                <div></div>
                            </div>
                        </div>
                    </div>
                    <div>{{item.intact}}%</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import visualTitle from '../common/visualTitle'

    // 设备完好率
    export default {
        name: "intact",
        components: {
            visualTitle
        },
        data() {
            return {
                intact: [],
            }
        },
        methods: {
            getData() {
                this.axios({
                    url: this.$host + '/intact_device/list?page=1&rows_pre_page=9',
                    method: 'get',
                }).then(res => {
                    this.intact = JSON.parse(JSON.stringify(res.data.data.content));
                })
            }
        },
        mounted() {
            this.getData();
        },
    }
</script>

<style scoped>
    .intact {
        padding: 10px;
        height: 254px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }

    .intact .dept {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 45px;
        padding: 10px 20px;
        color: #FFFFFF;
        font-size: 18px;
        border: 1px solid rgba(38, 133, 219, .3);
        /*margin-top: 10px;*/
        box-shadow: 0 0 5px rgba(38, 133, 219, .5) inset;
        background-color: rgba(38, 133, 219, .1);
        line-height: 25px;
    }

    .intact .dept > div:first-child {
        width: 100%;
        display: flex;
    }

    .intact .dept > div:first-child > div:first-child {
        width: 26px;
        height: 23px;
        text-align: center;
        color: #02bdc5;
        background-image: url("../../assets/img/polygon.png");
        background-size: 26px 23px;
        background-repeat: no-repeat;
        margin-right: 10px;
    }

    .intact .dept > div:first-child > div:last-child {
        margin: 8px;
        width: 200px;
        height: 7px;
        border-radius: 3px;
        background: #0d1940;
        position: relative;
    }

    .intact .dept .progress > div {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 7px;
        border-radius: 3px;
        overflow: hidden;
    }

    .intact .dept .progress > div > div {
        width: 200px;
        height: 7px;
        background: -moz-linear-gradient(left, rgb(37, 200, 104), rgb(254, 222, 1), rgb(255, 122, 0)); /**/
        background: -webkit-linear-gradient(left, rgb(37, 200, 104), rgb(254, 222, 1), rgb(255, 122, 0)); /**/
        background: -o-linear-gradient(left, rgb(37, 200, 104), rgb(254, 222, 1), rgb(255, 122, 0)); /**/
        background: -ms-linear-gradient(left, rgb(37, 200, 104), rgb(254, 222, 1), rgb(255, 122, 0)); /**/
        background: linear-gradient(to right, rgb(37, 200, 104), rgb(254, 222, 1), rgb(255, 122, 0)); /*用线性渐变创建图像*/
    }
</style>

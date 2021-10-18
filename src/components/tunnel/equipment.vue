<template>
    <div id="equipment">
        <visualTitle title="设备信息"></visualTitle>
        <div class="info">
            <div class="title">{{EQPInfo.deviceName}}</div>
            <div class="EQPInfo">
                <div><label>设备类型</label>：<div>{{EQPInfo.deviceType}}</div></div>
                <div><label>设备类别</label>：<div>{{EQPInfo.deviceCate}}</div></div>
                <div><label>设备状态</label>：<div>{{EQPInfo.deviceStatus}}</div></div>
                <div><label>使用时长</label>：<div>{{EQPInfo.duration}}</div></div>
                <div><label>购置日期</label>：<div>{{EQPInfo.collectTime}}</div></div>
                <div><label>生产厂家</label>：<div>{{EQPInfo.manufacturer}}</div></div>
            </div>
        </div>
    </div>
</template>

<script>
    import visualTitle from '../common/visualTitle'

    export default {
        name: "equipment",
        components: {
            visualTitle
        },
        props:{
            EQPInfo:{
                type: Object
            }
        }
    }
</script>

<style lang="scss" scoped>
    #equipment{
        width: 435px;
        .info{
            font-size: 17px;
            line-height: 26px;
            padding: 30px 25px 0 25px;
            background-color: rgba(0, 15, 36, .3);
            border: 1px solid #2f679b;
            .title {
                font-size: 28px;
                font-weight: 800;
                text-align: center;
                color: #00d2ff;
            }
            .EQPInfo{
                margin-top: 40px;
                >div{
                    margin-bottom: 15px;
                    display: flex;
                    label{
                        display: inline-block;
                        width: 80px;
                        text-align-last:justify;
                        text-align:justify;
                        text-justify:distribute-all-lines;
                    }
                    >div{
                        width: calc(100% - 97px);
                        height: auto;
                    }
                }
            }

        }
    }

</style>
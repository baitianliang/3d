<template>
    <div id="statistics">
        <visualTitle title="统计"></visualTitle>
        <v-transmit ref="transmit" :titleShow="false" class="transmit"></v-transmit>
        <v-scraper ref="scraper"></v-scraper>
        <visualTitle title="人员出勤数据"></visualTitle>
        <div class="attendance">
            <div>应到人数<span style="color: #1ecaf6">{{sum}}</span>人</div>
            <div>实到人数<span style="color: #1ecaf6">{{sum}}</span>人</div>
            <div>迟到人数<span>0</span>人</div>
            <div>旷工人数<span>0</span>人</div>
            <div>事假人数<span>0</span>人</div>
            <div>病假人数<span>0</span>人</div>
        </div>
    </div>
</template>

<script>
    import visualTitle from '../common/visualTitle'
    import vTransmit from '../visual/transmit'
    import vScraper from '../visual/scraper'

    export default {
        name: "statistics",
        components: {
            vTransmit,
            vScraper,
            visualTitle
        },
        props:{
            sum:{
                type: Number,
                default: 0
            }
        },
        data() {
            return {}
        },
        mounted() {
            // this.$refs.transmit.getData(68);
            this.$refs.scraper.getData(22240);
        },
    }
</script>

<style lang="scss" scoped>
    #statistics {
        width: 445px;
    }

    .title {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 10px;
    }

    .transmit {
        border: 1px solid #1b3a57;
    }

    .transmit, .attendance {
        background-color: rgba(0, 15, 36, .5);
        border: 1px solid #2f679b ;
    }

    .attendance {
        padding: 15px;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;

        > div {
            font-size: 16px;
            width: 170px;
            height: 50px;
            line-height: 50px;
            border-radius: 7px;
            text-align: center;
            box-shadow: 0 0 20px rgba(0,150,255,.9) inset;

            span {
                font-weight: 600;
                font-size: 18px;
                color: #e17a1e;
                margin: 0 10px;
            }
        }
         >div:nth-child(n + 3) {
             margin-top: 10px;
        }
    }
</style>
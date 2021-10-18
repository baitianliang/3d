<template>
    <div id="index">
        <v-header></v-header>
        <div class="main">
            <v-sidebar @getSidebarW="getSidebarW"></v-sidebar>
            <div class="content" ref="content">
<!--                <el-scrollbar style="height: 100%">-->
                    <v-pageHeader></v-pageHeader>
                    <router-view class="content_warp"/>
<!--                </el-scrollbar>-->
            </div>
        </div>
    </div>
</template>

<script>
    import vHeader from '../components/home/header'
    import vSidebar from '../components/home/sidebar'
    import vPageHeader from '../components/home/pageHeader'

    export default {
        name: "index",
        components: {
            vHeader,
            vSidebar,
            vPageHeader,
        },
        methods: {
            getSidebarW(val) {
                if (val) {
                    this.$refs.content.style.width = 'calc(100% - 1.64063rem)'
                } else {
                    this.$refs.content.style.width = 'calc(100% - 0.6510416666rem)'
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    .main {
        display: flex;
        height: calc(100% - 100px);
    }

    .content {
        margin: 15px;
        width: calc(100% - 315px);
        height: calc(100% - 30px);
        background-color: #ffffff;
        padding: 10px 15px 0 15px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
        transition: width 0.4s;
        transition-timing-function: ease;
        overflow: hidden;
        -moz-transition: width 0.4s; /* Firefox 4 */
        -moz-transition-timing-function: ease;
        -webkit-transition: width 0.4s; /* Safari and Chrome */
        -webkit-transition-timing-function: ease;
        -o-transition: width 0.4s; /* Opera */
        -o-transition-timing-function: ease;

        .content_warp {
            padding: 15px 10px 10px 10px;
        /*    height: 720px;*/
            height: calc(100% - 45px);
        }
    }

</style>

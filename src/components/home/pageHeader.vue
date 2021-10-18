<template>
    <div id="pageHeader">
        <div>当前位置：{{title}}</div>
    </div>
</template>

<script>
    export default {
        name: "pageHeader",
        data(){
            return{
                title:''
            }
        },
        methods:{
            getTitle(){
                this.title = this.$route.meta.name;
            },
        },
        mounted() {
            this.getTitle();
        },
        watch:{
            $route(to,from){
                this.getTitle();
            }
        },
    }
</script>

<style lang="scss" scoped>
    #pageHeader {
        padding: 10px;
        border-bottom: 1px solid #01417f;

        > div {
            font-size: 18px;
            border-left: 3px solid #036bc3;
            height: 25px;
            line-height: 25px;
            padding-left: 15px;
        }
    }
</style>
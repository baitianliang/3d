<template>
    <div id="visualWait">
        <div
                v-loading.fullscreen.lock="isWait"
                element-loading-background="rgba(0, 0, 0, 0.5)"></div>
    </div>
</template>

<script>
    export default {
        name: "visualWait",
        data() {
            return {
                isWait: true,
            }
        },
        methods: {
            wait() {
                let timeout = setTimeout(() => {
                    this.isWait = false;
                    let is3D = sessionStorage.getItem('is3D');
                    if (is3D === 'true'){
                        this.$router.push({
                            path: '/visual3D'
                        });
                    } else{
                        this.$router.push({
                            path: '/visual'
                        });
                    }
                    clearTimeout(timeout)
                }, 500)
            },
        },
        mounted() {
            this.wait()
        }
    }
</script>

<style scoped>
    #visualWait {
        min-height: 100%;
        background-image: url("../assets/img/bg.jpg");
        background-attachment: fixed;
    }
</style>

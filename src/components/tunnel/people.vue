<template>
    <div id="people">
        <visualTitle title="人员信息"></visualTitle>
        <div class="info">
            <div class="avatar">
                <img src="../../assets/img/tunnelUser.png" alt="">
            </div>
            <div class="userInfo">
                <div class="title">{{userInfo.username}}</div>
                <div><label>性别</label>：{{userInfo.userGender}}</div>
                <div><label>年龄</label>：{{userInfo.userAge}}</div>
                <div><label>所属部门</label>：{{userInfo.userDep}}</div>
                <div><label>巡检状态</label>：{{userInfo.userStatus}}</div>
                <div><label>工作时长</label>：{{userInfo.userWorkDuration}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import visualTitle from '../common/visualTitle'

    export default {
        name: "people",
        components: {
            visualTitle
        },
        props:{
            userInfo:{
                type: Object
            },
        }
    }
</script>

<style lang="scss" scoped>
    #people {
        .info {
            display: flex;
            justify-content: space-between;
            background-color: rgba(0, 15, 36, .3);
            border: 1px solid #2f679b;
            padding: 25px;

            .title {
                font-size: 22px;
                font-weight: 800;
                margin-bottom: 10px;
            }

            .avatar {
                height: 220px;
                width: 145px;
                text-align: center;
                img {
                    height: 220px;
                    width: auto;
                }
            }

            .userInfo {
                font-size: 17px;
                line-height: 26px;
                width: calc(100% - 170px);

                > div {
                    height: 26px;
                    margin-bottom: 10px;
                    font-weight: 600;

                    label {
                        display: inline-block;
                        width: 80px;
                        text-align-last: justify;
                        text-align: justify;
                        text-justify: distribute-all-lines;
                    }
                }

            }
        }

    }

</style>
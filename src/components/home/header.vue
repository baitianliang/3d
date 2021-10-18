<template>
    <div id="headers">
        <div>
            <img src="../../assets/img/logo.png" alt="">
            山东矿机智慧管理平台
        </div>
        <div>
            <div>
                <div @click="fullScreenEvent('3D')">
                    <img src="../../assets/img/dataVisual.png" alt="">
                    3D大屏
                </div>
                <div @click="fullScreenEvent">
                    <img src="../../assets/img/dataVisual.png" alt="">
                    大屏展示
                </div>
            </div>
            <div>
                <!--                <img :src="this.$store.state.userAvatar" alt="">-->
                <img src="../../assets/img/user.png" alt="">
                <el-dropdown @command="handleCommand" placement="bottom">
      <span class="el-dropdown-link">
        {{$store.state.trueName}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="resetPassWord">修改密码</el-dropdown-item>
                        <el-dropdown-item command="loginOut">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <el-dialog
                title="修改密码"
                :visible.sync="dialogVisible"
                width="500px"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @close="handleClose">
            <el-form class="form" ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="旧密码" prop="oldPwd">
                    <el-input v-model="form.oldPwd" placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPwd">
                    <el-input v-model="form.newPwd" placeholder="请输入新密码"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submit">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import _ from '../../assets/js/unit'
    import API from '../../api/api'
    import qs from 'qs'

    export default {
        name: "headers",
        data() {
            return {
                form: {
                    oldPwd: '',
                    newPwd: '',
                },
                rules: {
                    oldPwd: [
                        {required: true, message: '请输入旧密码', trigger: 'blur'},
                    ],
                    newPwd: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                    ],
                },
                dialogVisible: false,
            }
        },
        methods: {
            handleCommand(val) {
                if (val === 'resetPassWord') {
                    //重置密码
                    this.dialogVisible = true
                } else if (val === 'loginOut') {
                    //退出
                    this.loginOut();
                }
            },
            loginOut() {
                localStorage.removeItem('login');
                localStorage.removeItem('token');
                localStorage.removeItem('restrict');
                localStorage.removeItem('userId');
                localStorage.removeItem('roleId');
                _.setCookie('token', ' ', -1);
                this.$router.push('/login');
            },

            fullScreenEvent(str) {
                let el = document.documentElement;
                if (el.requestFullscreen) {
                    el.requestFullscreen();
                } else if (el.mozRequestFullScreen) {
                    el.mozRequestFullScreen();
                } else if (el.webkitRequestFullScreen) {
                    el.webkitRequestFullScreen();
                } else if (el.msRequestFullscreen) {
                    el.msRequestFullscreen();
                }
                let timeout = setTimeout(()=>{
                    if (str === '3D'){
                        sessionStorage.setItem('is3D','true');
                    }else{
                        sessionStorage.setItem('is3D','false');
                    }
                    this.$router.push({path:'/visualWait'});
                    clearTimeout(timeout)
                },50)
                // }
            },

            handleClose() {
                let timeout = setTimeout(() => {
                    this.form = {
                        oldPwd: '',
                        newPwd: '',
                    }
                    clearTimeout(timeout)
                }, 350)
            },

            submit() {
                let params = {
                    oldPwd: this.form.oldPwd,
                    newPwd: this.form.newPwd
                }
                this.axios({
                    url: this.$http + API.userEditPwd,
                    method: 'post',
                    data: qs.stringify(params)
                }).then(res => {
                    if (res.data.status === 0) {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        let timeout = setTimeout(() => {
                            this.dialogVisible = false;
                            this.loginOut();
                            clearTimeout(timeout);
                        }, 3000)
                    } else {
                        this.$message.error(res.data.statusDesc)
                    }
                })
            },
        },
        mounted() {
            let isFullscreen =
                document.fullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement ||
                document.fullScreen ||
                document.mozFullScreen ||
                document.webkitIsFullScreen;
            isFullscreen = !!isFullscreen;
            let that = this;
            document.addEventListener("fullscreenchange", () => {
                that.isFullScren = !that.isFullScren;
                that.$store.commit('upIsFullScreen', !that.$store.state.isFullScreen)
            });
            document.addEventListener("mozfullscreenchange", () => {
                that.isFullScren = !that.isFullScren;
                that.$store.commit('upIsFullScreen', !that.$store.state.isFullScreen)
            });
            document.addEventListener("webkitfullscreenchange", () => {
                that.isFullScren = !that.isFullScren;
                that.$store.commit('upIsFullScreen', !that.$store.state.isFullScreen)
            });
            document.addEventListener("msfullscreenchange", () => {
                that.isFullScren = !that.isFullScren;
                that.$store.commit('upIsFullScreen', !that.$store.state.isFullScreen)
            });
        }
    }
</script>

<style lang="scss" scoped>
    #headers {
        height: 100px;
        display: flex;
        justify-content: space-between;
        padding: 20px 50px 20px 25px;
        color: #ffffff;
        background-image: url("../../assets/img/bj_01.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;

        img {
            vertical-align: middle;
        }

        > div:first-child {
            font-size: 26px;
            line-height: 60px;

            img {
                height: 55px;
                position: relative;
                top: -5px;
            }
        }

        > div:nth-child(2) {
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 380px;
            font-weight: 600;

            > div:first-child {
                display: flex;

                div{
                    min-width: 100px;
                    cursor: pointer;
                    img{
                        width: 51px;
                        height: 44px;
                    }
                }
                div+div{
                    margin-left: 20px;
                }
            }

            > div:last-child {
                margin-left: 20px;
                > img {
                    display: inline-block;
                    width: 35px;
                    height: 35px;
                    background: #ffffff;
                    border-radius: 50%;
                    margin-right: 10px;
                }

                .el-dropdown {
                    color: #ffffff;
                    cursor: pointer;
                }
            }

        }
    }
</style>

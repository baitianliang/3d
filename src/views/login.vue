<template>
    <div id="login">
        <div class="title">
            <img src="../assets/img/logo.png" alt="">
            山东矿业集团基础管理平台
        </div>
        <div class="box">
            <div class="box-title">
                <div class="is-active" ref="login" @click="tabs('login')">登录</div>
                <div></div>
                <div ref="reg" @click="tabs('reg')">注册</div>
            </div>
            <div class="form">
                <div class="login" v-if="isLogin">
                    <el-input v-model="username" placeholder="请输入邮箱/手机号"></el-input>
                    <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
                    <div class="isSave">
                        <el-checkbox v-model="isSave" v-show="isSave">记住密码</el-checkbox>
                        <div></div>
                        <el-button type="text">忘记密码？</el-button>
                    </div>
                </div>
                <div class="reg" v-else>
                    <el-input v-model="username" placeholder="请输入邮箱/手机号"></el-input>
                    <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
                </div>
                <div class="btn" @click="submit">{{isLogin ? '登录':'注册'}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import API from '../api/api'
    import _ from '../assets/js/unit'
    import qs from 'qs'

    export default {
        name: "login",
        data() {
            return {
                username: 'root',
                password: '111111',
                isSave: false,
                isLogin: true,
            }
        },
        methods: {
            tabs(val) {
                this.username = '';
                this.password = '';
                if (val === 'login') {
                    this.isLogin = true;
                } else if (val === 'reg') {
                    this.isLogin = false;
                }
            },
            submit() {
                if (this.username !== '' && this.password !== '') {
                    if (this.isLogin) {
                        this.loginAjax();
                    } else {
                        this.regAjax();
                    }
                }
            },
            loginAjax() {
                let params = {
                    client_id: 'c1',
                    client_secret: 'secret',
                    grant_type: 'password',
                    username: this.username,
                    password: this.password,
                };
                this.axios({
                    url: this.$http + API.login,
                    method: 'post',
                    data: qs.stringify(params)
                }).then(res => {
                    _.setCookie('token', res.data.access_token, res.data.expires_in);
                    localStorage.login = true;
                    localStorage.token = res.data.access_token;
                    this.$store.commit('upLogin', true);
                    this.$store.commit('upToken', res.data.access_token);
                    this.userInfoQuery();
                }).catch(err => {
                    if (err.response.status === 401) {
                        this.$message.error('账户或密码错误');
                    }
                })
            },
            regAjax() {
                let params = {
                    userName: this.username,
                    passWord: this.password,
                }
                this.axios({
                    url: this.$http + API.reg,
                    method: 'post',
                    params: params
                }).then(res =>{
                    if (res.data.status === 0){
                        this.dialogVisible = false;
                        this.$message({
                            type: 'success',
                            message: '注册成功'
                        });
                        let timeout = setTimeout(()=>{
                            this.loginAjax();
                            clearTimeout(timeout);
                        },200)
                    }else{
                        this.$message.error(res.data.statusDesc);
                    }
                })
            },
            //获取用户信息
            userInfoQuery(){
                this.axios({
                    url: this.$http + API.userInfo,
                    method: 'get',
                }).then(res =>{
                    this.$store.commit('upUserName', res.data.result.userName);
                    this.$store.commit('upRoleId', res.data.result.userType);
                    // this.$store.commit('upNickName', res.data.result.userTrueName);
                    this.$store.commit('upTrueName', res.data.result.userTrueName);
                    localStorage.setItem('userName', res.data.result.userName);
                    localStorage.setItem('roleId', res.data.result.userType);
                    localStorage.setItem('trueName', res.data.result.userTrueName);
                    if(res.data.result.userName === "root") this.$router.push('/statistics')
                    else this.$router.push('/equipmentInventory')
                })

            },
        },
        mounted() {

        },
        watch: {
            isLogin(newName, oldName) {
                if (newName) {
                    this.$refs.login.classList.add('is-active');
                    this.$refs.reg.classList.remove('is-active');
                } else {
                    this.$refs.login.classList.remove('is-active');
                    this.$refs.reg.classList.add('is-active');
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    #login {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        background-image: url("../assets/img/loginBg.jpg");
        background-size: 1920px 1080px;
        background-repeat: no-repeat;

        .title {
            position: absolute;
            top: 80px;
            height: 90px;
            line-height: 90px;
            font-size: 40px;
            color: #ffffff;

            img {
                vertical-align: middle;
                position: relative;
                top: -5px;
                height: 70px;
            }
        }

        .box {
            width: 440px;
            position: absolute;
            top: 240px;
            border-radius: 15px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
            background-color: rgba(255, 255, 255, .8);
            padding: 30px;

            .box-title {
                display: flex;
                justify-content: center;
                font-size: 26px;

                > div {
                    cursor: pointer;
                    text-align-last: justify;
                    width: 90px;
                }

                > div:nth-child(2) {
                    padding: 0;
                    height: 30px;
                    width: 0;
                    margin: 0 20px;
                    border-left: 1px solid #000;
                    cursor: inherit;
                }

                .is-active {
                    color: #0279EF;
                }
            }

            .form {
                margin-top: 15px;

                .el-input {
                    font-size: 18px;
                    margin-top: 20px;
                    height: 60px;
                    line-height: 60px;
                }

                .isSave {
                    display: flex;
                    justify-content: space-between;
                    height: 50px;
                    line-height: 50px;
                    font-size: 16px;

                    .el-button {
                        padding: 0;
                    }
                }

            }

            .btn {
                height: 60px;
                line-height: 60px;
                color: #fff;
                border-radius: 15px;
                text-align: center;
                font-size: 22px;
                margin-top: 30px;
                cursor: pointer;
                background: linear-gradient(to right, rgb(0, 118, 239), rgb(62, 195, 239));
            }
        }
    }

</style>

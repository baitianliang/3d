import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import '@/assets/css/reset.css'
import 'element-ui/lib/theme-chalk/index.css';
import echarts from 'echarts/lib/echarts'
import axios from 'axios'
import '@/assets/css/main.css'
import _ from './assets/js/unit.js'
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
import '@/assets/js/flexible.js'
import API from './api/api.js'

Vue.use(VideoPlayer);
Vue.use(ElementUI);

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.prototype.axios = axios;
Vue.prototype.$host = '/kj/bdata';
Vue.prototype.$http = '/kj';

axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if (config.method === 'post') {
        config.headers.common = {
            // 'Content-Type': 'application/x-www-form-urlencoded'
            'Content-Type': 'application/json'
        };
    }else if (config.method === 'get') {
        config.headers.common = {
            'Accept': 'application/json'
        };
    }

    if (config.url.indexOf('public') === -1 && config.url.indexOf('token') === -1) {
        config.headers.common = {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        };
    }

    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    // let roleId = parseInt(localStorage.getItem('roleId'));
    //token 过期
    if (_.IsCookis() === false) {
        if (to.path !== '/login') {
            if (localStorage.getItem('token') !== '') {
                ElementUI.Message({
                    message: '登录信息已失效，请重新登录',
                    type: 'warning'
                })
            }
            next({path: '/login'});
        } else {
            next();
        }
    } else {
        next();
    }
});
//防止路由重复  警告报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

new Vue({
    router,
    store,
    created() {
        if (_.IsCookis() === false) {
            this.$router.push({path: '/login'});
        } else {
            if (localStorage.getItem('token') === '' || localStorage.getItem('token') === undefined || localStorage.getItem('token') === null) {
                localStorage.setItem('token', _.getCookie('token'))
                localStorage.setItem('login', 'true');
                this.$store.commit('upToken', _.getCookie('token'))
                this.$store.commit('upLogin', true)
                axios({
                    url: this.$http + API.userInfo,
                    method: 'get',
                    header: {
                        Authorization: 'Bearer' + this.$store.state.token
                    }
                }).then(res => {
                    this.$store.commit('upUserName', res.data.result.userName);
                    this.$store.commit('upRoleId', res.data.result.userType);
                    // this.$store.commit('upNickName', res.data.result.userTrueName);
                    this.$store.commit('upTrueName', res.data.result.userTrueName);
                    localStorage.setItem('roleId', res.data.result.userType);
                    localStorage.setItem('trueName', res.data.result.userTrueName);
                })
            } else {
                this.$store.commit('upLogin', localStorage.getItem('login'));
                this.$store.commit('upToken', localStorage.getItem('token'));
                this.$store.commit('upUserAvatar', localStorage.getItem('user_Avatar'));
                this.$store.commit('upUserName', localStorage.getItem('user_name'));
                this.$store.commit('upRoleId', localStorage.getItem('roleId'));
                this.$store.commit('upTrueName', localStorage.getItem('trueName'));
            }
        }
    },
    render: h => h(App)
}).$mount('#app')

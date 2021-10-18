import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        login: '',
        token: '',
        userAvatar: '',
        userName: '',
        trueName: '',
        roleId: '',
        isFullScreen: false,
        authorities: ''
        // location: 0,
    },
    mutations: {
        upAuthorities(state, val){
            state.authorities = val
            console.log(val)
        },
        upLogin(state, val) {
            state.login = val
        },
        upToken(state, val) {
            state.token = val
        },
        upUserAvatar(state, val) {
            state.userAvatar = val
        },
        upUserName(state, val) {
            state.userName = val
        },
        upTrueName(state, val) {
            if (val === null){
                state.trueName = '未命名'
            } else{
                state.trueName = val
            }
        },
        upRoleId(state, val) {
            state.roleId = val
        },
        upIsFullScreen(state, val){
            state.isScreen = val
        },
    //     upLocation(state,val){
    //         state.location = val
    //     },
    },
    actions: {},
    modules: {}
})

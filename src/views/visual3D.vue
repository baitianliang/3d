<template>
    <div class="visual bg" ref="visualBg">
        <div id="visual" ref="visual">
            <el-scrollbar style="height: 100%;width: 100%;"
                          :wrap-style="[{overflowX:'hidden'}]"
                          :no-resize="true"
            >
                <visualNav :index="0" :locationText="locationText"></visualNav>
                <div class="main">
                    <div>
                        <div class="datagraphic">
                            <v-support ref="support"></v-support>
                        </div>
                        <div class="datagraphic transmitBlock">
                            <v-transmit ref="transmit"></v-transmit>
                        </div>
                        <div class="datagraphic">
                            <!--                        <v-intact></v-intact>-->
                            <v-support ref="support1" title="采掘设备"></v-support>
                        </div>
                    </div>
                    <div style="position: relative">
                        <v-maps @getLoactionId="locationIdChange"></v-maps>
                        <v-realTime ref="realTime"></v-realTime>
                        <div id="warning" v-if="isWarning" @click="warningClick">
                            <transition name="fade">
                                <img src="../assets/img/warning.png" alt="警告" v-show="imgShow">
                            </transition>
                        </div>
                        <transition
                                v-bind:css="false"
                                v-on:before-enter="beforeEnter"
                                v-on:enter="enter"
                                v-on:leave="leave"
                        >
                            <img id="dazzle" v-if="dazzleShow" src="../assets/img/dazzle.png" alt="">
                        </transition>
                    </div>
                    <div class="clock">
                        <div class="date">{{date[0]}}年{{date[1]}}月{{date[2]}}日</div>
                        <div class="hour num">
                            <div>{{h[0]}}</div>
                            <div>{{h[1]}}</div>
                        </div>
                        <div class="separate">
                            <div></div>
                            <div></div>
                        </div>
                        <div class="minute num">
                            <div>{{m[0]}}</div>
                            <div>{{m[1]}}</div>
                        </div>
                        <div class="separate">
                            <div></div>
                            <div></div>
                        </div>
                        <div class="second num">
                            <div>{{s[0]}}</div>
                            <div>{{s[1]}}</div>
                        </div>
                    </div>
                    <div>
                        <div class="datagraphic">
                            <v-monitoring></v-monitoring>
                        </div>
                        <div class="datagraphic">
                            <v-scraper ref="scraper"></v-scraper>
                        </div>
                        <div class="datagraphic">
                            <v-reduction ref="reduction"></v-reduction>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
    import visualNav from '../components/common/visualNav'
    import visualTitle from '../components/common/visualTitle'
    import vIntact from '../components/visual/intact'
    import vMaps from '../components/visual/map3D'
    import vRealTime from '../components/visual/realTime'
    import vReduction from '../components/visual/reduction'
    import vScraper from '../components/visual/scraper'
    import vSupport from '../components/visual/support'
    import vTransmit from '../components/visual/transmit'
    import vMonitoring from '../components/visual/monitoring'
    import '../assets/js/velocity.min'

    export default {
        name: 'visual',
        components: {
            visualNav,
            visualTitle,
            vIntact,
            vMaps,
            vRealTime,
            vReduction,
            vScraper,
            vSupport,
            vTransmit,
            vMonitoring
        },
        data() {
            return {
                locationText: '山东矿机集团',
                location: 0,//工作面
                locationId: 0,//地图id
                isCompany: false,
                locationList: [22240, 22241, 22242],//工作面数组
                count: 0,//当前工作面下标
                locationInterval: null,//工作面计时器
                isWarning: false,//是否警告
                imgShow: false,//闪烁
                imgTimeInterval: null,//闪烁计时器
                socket: '',
                warningList: [],

                date: [0, 0, 0],
                h: [0, 0],
                m: [0, 0],
                s: [0, 0],
                yy: 0,
                MM: 0,
                dd: 0,
                hh: 0,
                mm: 0,
                ss: 0,

                checkInterval: null,//时钟计时器
                dazzleShow: false,
            }
        },
        methods: {
            timeOut() {
                this.locationInterval = setInterval(() => {
                    if (this.count >= 0 && this.count <= this.locationList.length) {
                        this.count++;
                        if (this.count === this.locationList.length) {
                            this.count = 0;
                        }
                    }
                }, 300000);
            },
            getLocation() {
                this.location = this.locationList[this.count];
            },
            getTime() {
                this.axios({
                    url: this.$host + '/timer/check',
                    // url:this.$host + 'timer/test',
                    method: 'get',
                }).then(res => {
                    let date = res.data.data.substr(0, 10);
                    let h = res.data.data.substr(11, 2);
                    let m = res.data.data.substr(14, 2);
                    let s = res.data.data.substr(17, 2);
                    this.yy = parseInt(date.substr(0, 4));
                    this.MM = parseInt(date.substr(5, 2));
                    this.dd = parseInt(date.substr(8, 2));
                    this.hh = parseInt(h);
                    this.mm = parseInt(m);
                    this.ss = parseInt(s);
                    this.date = date.split('-');
                    this.h = h.split('');
                    this.m = m.split('');
                    this.s = s.split('');
                    this.check();
                })
            },
            check() {
                this.checkInterval = setInterval(() => {
                    this.ss = this.ss + 1;
                    if (this.ss === 60) {
                        this.mm = this.mm + 1;
                        this.ss = 0;
                    }
                    if (this.mm === 60) {
                        this.hh = this.hh + 1;
                        this.mm = 0;
                    }
                    if (this.hh === 24) {
                        this.dd = this.dd + 1;
                        this.hh = 0;
                    }
                    if (this.hh === 0 && this.mm === 0 && this.ss === 0) {
                        this.getTime();
                    }

                    this.date = [];
                    this.h = [];
                    this.m = [];
                    this.s = [];
                    this.date.push(this.yy)
                    if (this.MM < 10) {
                        let M = '0' + this.MM;
                        this.date.push(M);
                    } else {
                        this.date.push(this.MM)
                    }
                    if (this.dd < 10) {
                        let d = '0' + this.dd
                        this.date.push(d)
                    } else {
                        this.date.push(this.dd)
                    }
                    if (this.ss < 10) {
                        let s = '0' + this.ss;
                        this.s = s.split('')
                    } else {
                        this.s = this.ss.toString().split('')
                    }
                    if (this.mm < 10) {
                        let m = '0' + this.mm;
                        this.m = m.split('')
                    } else {
                        this.m = this.mm.toString().split('')
                    }
                    if (this.hh < 10) {
                        let h = '0' + this.hh;
                        this.h = h.split('')
                    } else {
                        this.h = this.hh.toString().split('')
                    }
                    // console.log(this.date + ' ' + this.h[0]+this.h[1]+'时'+this.m[0]+this.m[1]+'分'+this.s[0]+this.s[1]+'秒')
                    // console.log(this.yy + '年' + this.MM + '月' + this.dd + '日 ' + this.hh + '时' + this.mm + '分' + this.ss + '秒')
                }, 1000)
            },
            locationIdChange(id, isCompany, name) {
                this.locationId = id;
                this.isCompany = isCompany;
                if (isCompany === true || isCompany === 'all') {
                    this.locationText = name
                }
            },

            //警报点击
            warningClick() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                this.$router.push('/message')
            },
            //ws
            clearInterval() {
                clearInterval(this.imgTimeInterval);
                this.imgTimeInterval = null;
            },
            wsInit() {
                if (typeof (WebSocket) === "undefined") {
                    alert("您的浏览器不支持socket")
                } else {
                    // 实例化socket
                    this.socket = new WebSocket('ws://data.jthapp.com:23459/ws/1');
                    // 监听socket连接
                    this.socket.onopen = this.open;
                    // 监听socket消息
                    this.socket.onmessage = this.getMessage;
                }
            },
            open() {
                console.log("socket连接成功")
            },
            getMessage(msg) {
                this.warningList = [];
                if (JSON.stringify(JSON.parse(msg.data).supplement) !== '{}') {
                    this.isWarning = true;
                    for (var i in JSON.parse(msg.data).supplement) {
                        this.warningList.push(JSON.parse(msg.data).supplement[i])
                    }
                    this.imgTimeInterval = setInterval(() => {
                        this.imgShow = !this.imgShow;
                    }, 300)
                } else if (JSON.stringify(JSON.parse(msg.data).supplement) === '{}') {
                    this.isWarning = false;
                    this.clearInterval();
                }
            },
            send() {
                // this.socket.send(params)
            },

            //闪烁动画
            beforeEnter: function (el) {
                el.style.opacity = 0
            },
            enter: function (el, done) {
                let vm = this;
                Velocity(el,
                    { opacity: 1 },
                    {
                        duration: 1000,
                        complete: function () {
                            done();
                            vm.dazzleShow = false
                        }
                    }
                )
            },
            leave: function (el, done) {
                let vm = this
                Velocity(el,
                    { opacity: 0 },
                    {
                        duration: 1000,
                        complete: function () {
                            done()
                            vm.dazzleShow = true
                        }
                    }
                )
            },
            getResolutions() {
                let width = screen.width;
                let height = screen.height;
                let left = width / 1920;
                let top = height / 1080;
                if (width / height === 1920/1080) {
                    this.$refs.visual.style.transform = `scale(${left},${top})`;
                }else if(width / height > 1920/1080){
                    // alert('宽'+top)
                    this.$refs.visual.style.transform = `scale(${top},${top})`;
                }else if(width / height < 1920/1080){
                    // alert('窄'+left)
                    this.$refs.visual.style.transform = `scale(${left},${left})`;
                }

            },
        },
        mounted() {
            this.getResolutions();
            this.getLocation();
            this.timeOut();
            this.getTime();
            this.wsInit();
            this.dazzleShow = true;
        },
        destroyed() {
            clearInterval(this.locationInterval);
            this.locationInterval = null;
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        },
        watch: {
            count(newVal, oldVal) {
                this.location = this.locationList[newVal];
            },
            location(newVal, oldVal) {
                this.$refs.realTime.getData(newVal);
                this.$refs.scraper.getData(newVal);
                this.$refs.reduction.getData(newVal);
            },
            locationId(newVal, oldVal) {
                if (this.isCompany === true){
                    this.$refs.transmit.getData(newVal);
                } else if (this.isCompany === false) {
                    this.$refs.support.getData(newVal);
                    this.$refs.support1.getData(newVal);
                }else{
                    this.$refs.transmit.getData(newVal);
                    this.$refs.support.getData(newVal);
                    this.$refs.support1.getData(newVal);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .bg{
        background-image: url("../assets/img/bg.jpg");
        background-size: 100% auto;
        background-attachment: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #visual {
        color: #ffffff;
        width: 1920px;
        height: 1080px;
    }

    #dazzle {
        position: absolute;
        z-index: 1;
        bottom: 242px;
        left: calc(50% - 425px);
    }

    .main {
        width: 1920px;
        display: flex;
        justify-content: space-between;
        padding: 0 30px 15px 30px;
        position: relative;
    }

    .main > div:first-child {
        width: 430px;
        margin-top: 20px;
    }

    .main > div:nth-child(2) {
        width: 920px;
        position: relative;
    }

    .main > div:last-child {
        width: 450px;
        margin-top: 20px;
    }

    .clock {
        position: absolute;
        top: 40px;
        left: calc(50% - 350px);
        display: flex;
        font-size: 32px;
        width: 700px;

        .date {
            font-size: 24px;
            line-height: 60px;
            margin-right: 15px;
            color: transparent;
            background: linear-gradient(to right, rgb(0, 115, 255), rgb(0, 235, 255), rgb(0, 115, 255));
            -webkit-background-clip: text;
        }

        .num {
            display: flex;

            div {
                text-align: center;
                font-weight: bold;
                margin: 0 5px;
                width: 60px;
                height: 60px;
                color: #00c4f5;
                line-height: 60px;
                background-image: url("../assets/img/clockBg.png");
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
        }

        .separate {
            padding-top: 5px;
            margin: 0 5px;

            div {
                width: 10px;
                height: 10px;
                margin: 10px 0;
                background: -moz-linear-gradient(bottom, rgb(0, 196, 245), rgba(0, 196, 245, 0)); /**/
                background: -webkit-linear-gradient(bottom, rgb(0, 196, 245), rgba(0, 196, 245, 0)); /**/
                background: -o-linear-gradient(bottom, rgb(0, 196, 245), rgba(0, 196, 245, 0)); /**/
                background: -ms-linear-gradient(bottom, rgb(0, 196, 245), rgba(0, 196, 245, 0)); /**/
                background: linear-gradient(to top, rgb(0, 196, 245), rgba(0, 196, 245, 0)); /*用线性渐变创建图像*/
            }
        }
    }
    #warning {
        /*background: dodgerblue;*/
        width: 46px;
        height: 46px;
        position: absolute;
        top: 45px;
        left: 30px;
        color: #F97A79;
        cursor: pointer;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to{
        opacity: 0;
    }
</style>

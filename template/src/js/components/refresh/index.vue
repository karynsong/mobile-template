<template>
    <div @touchend="touchend">
        <div class="wrap-loading set-mr set-zindex">
            <span class="ff-icon ff-refresh" :class="[gtRefreshDistance ? 'up' : '']">&#xe6e6;</span>{{refreshText}}
        </div>
        <div class="wrap-loading ball-pulse" v-show="needRefresh">
            <div></div>
            <div></div>
            <div></div>
        </div>
        <transition name="fade">
            <div class="wrap-loading fade-transition" v-show="fetchEnd">
                <span class="ff-icon ff-refresh-success"></span>刷新成功
            </div>
        </transition>
        <slot></slot>
    </div>
</template>
<script>
var touchend = false
const refreshDistance = 60
export default {
    data() {
        return {
            refreshText: '下拉刷新',
            needRefresh: false,
            gtRefreshDistance: false,
            fetchEnd: false
        }
    },
    props: {
        'iScroll': {
            type: Object,
            default() {
                return {}
            }
        },
        'distance': {
            default: () => 200
        },
        // 'needLoadMore': {
        //     default: () => false
        // }
    },
    watch: {
        iScroll(val) {
            const self = this
            val.on('scrollEnd', function () {
                if (self.needRefresh) {
                    self.refresh()
                } else {
                    // console.log('不用刷心')
                }
                if (this.y - this.maxScrollY < self.distance) {
                    self.loadMore()
                }
            })
            val.on('scroll', function () {
                this.y > refreshDistance ? self.refreshText = '释放立即刷新' : self.refreshText = '下拉刷新'
                self.gtRefreshDistance = this.y > refreshDistance

                if (touchend) {
                    touchend = false
                    if (this.y >= refreshDistance) {
                        self.fetchEnd = false
                        self.needRefresh = true
                    } else {
                        self.refreshText = '下拉刷新'
                        self.needRefresh = false
                    }
                }
            })
        }
    },
    methods: {
        // iScroll 监控不到用户手指离开屏幕的时刻
        touchend() {
            touchend = true
        },
        refresh() {
            this.$emit('refresh')
        },
        loadMore() {
            this.$emit('loadMore')
        },
        refreshFinished() {
            this.iScroll.refresh()
            this.needRefresh = false
            this.refreshText = '下拉刷新'
            this.fetchEnd = true
            setTimeout(() => {
                this.fetchEnd = false
            }, 1800)
        }
    }
}
</script>

<style lang="sass">
@import "src/css/bmcss/core/reset";

@-webkit-keyframes scale {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 1;
    }

    45% {
        -webkit-transform: scale(0.1);
        transform: scale(0.1);
        opacity: 0.7;
    }

    80% {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 1;
    }
}
@keyframes scale {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 1;
    }

    45% {
        -webkit-transform: scale(0.1);
        transform: scale(0.1);
        opacity: 0.7;
    }

    80% {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 1;
    }
}
.set-mr {
    margin-top: -.6rem;
}
.wrap-loading,
ball-pulse {
    @include align();
    @include rect(100%,.6rem);
}

.ball-pulse div {
    @include square(.08rem);
    border-radius: 50%;
    margin: .04rem;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    display: inline-block;
    background: #ceced9;
}
.ball-pulse>div:nth-child(1) {
    -webkit-animation: scale 0.75s 0.12s infinite cubic-bezier(.2, .68, .18, 1.08);
    animation: scale 0.75s 0.12s infinite cubic-bezier(.2, .68, .18, 1.08);
}

.ball-pulse>div:nth-child(2) {
    -webkit-animation: scale 0.75s 0.24s infinite cubic-bezier(.2, .68, .18, 1.08);
    animation: scale 0.75s 0.24s infinite cubic-bezier(.2, .68, .18, 1.08);
}

.ball-pulse>div:nth-child(3) {
    -webkit-animation: scale 0.75s 0.36s infinite cubic-bezier(.2, .68, .18, 1.08);
    animation: scale 0.75s 0.36s infinite cubic-bezier(.2, .68, .18, 1.08);
}

.ff-refresh {
    -webkit-transition: .2s linear;
    transition: .2s linear;
    font-size: .21rem;
    color: #ceced9;
    margin-right: .1rem;
}
.ff-refresh-success::before {
    content:"\e6e7";
    margin-right: .1rem;
    font-size: .15rem;
    color: #717884;
}
.up {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
}
.fade-transition {
    -webkit-transition: height .4s ease;
    transition: height .4s ease;
    @include align();
}
.fade-leave-to {
    height: 0;
}
.set-zindex {
    position: absolute;
    z-index: -1;
}
</style>

<template>
    <!--<div id="von-app"></div>-->
    <div benmu-app>
        <!--<header class="yo-header yo-header-wechat">
            北京通·京医通官方微信服务平台
        </header>-->
        <transition name="page">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>

import {
    mapActions,
    mapGetters
} from 'vuex'

import getphoneModel from 'Utils/ua';

export default {
    computed: mapGetters(['userinfoGetter']),
    methods: {
        ...mapActions(['getUserInfo']),
        bindEvent() {
            GLOBAL.vbus.$on('ajax_error', (resData) => {
                $dialog.popup({
                    content: resData && resData.msg || '网络请求出错，请重试'
                });
            })

                .$on('goLogin', () => {
                    console.log('login')
                })
        },
        async init() {
            var userInfo = await this.getUserInfo();
        }
    },
    created () {
        this.bindEvent();
        this.$store.commit('userInfo/setWXConfigInfo', GLOBAL.useInfo || {});

        var usInfo = getphoneModel();
        $Beacon('wechatV2-device', {
            extra_d: usInfo.type,
            extra_e: usInfo.system,
            extra_f: usInfo.model
        });
    },
    mounted() {
        // this.init();
    },
    destroyed() {
        this.$BM_loginModal && $modal.destroy(this.$BM_loginModal);
    }
}
</script>

<template>
    <div class="benmu-flex bg-white">
        <div class="login-index-bg"></div>
        <div class="login-index-main">
            <section class="yo-list yo-list-input">
                <input-box v-model="phone" label="手机号" :maxlength="11" type="tel" placeholder="请输入手机号登录账户"></input-box>
            </section>
            <div class="btn-box"><div class="yo-btn yo-btn-l yo-btn-bm-v1 yo-btn-green" @click="submit" :class="{'yo-btn-gray': !phone}">下一步</div></div>
            <div class="login-index-type">
                <div class="login-index-line"></div>
            </div>
            <div class="btn-box">
                <div class="yo-btn yo-btn-l yo-btn-bm-v1 yo-btn-wechat" @click="wechat">
                    <i class="login-index-wechat-logo"></i>
                    <span class="c-wechat">微信登录</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { validationMixin } from 'vuelidate';
import { isPhone } from 'Utils/vlidate';

export default {
    pageInfo: {
        title: '京医通'
    },
    mixins: [validationMixin],
    validations: {
        phone: {
            isPhone
        }
    },
    data () {
        return {
            backPath: '',
            phone: ''
        }
    },
    methods: {
        submit(){

        },
        wechat(){

        }
    },
    mounted () {
        this.phone = this.$globalContext.get('login.home.phone');
    }
}
</script>

<style>
.hosMapIntorWrap {
    bottom: .74rem;
}
</style>

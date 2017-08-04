if (!window.Promise) {
    window.Promise = require('es6-promise').Promise
}
import 'gsap';

var FastClick = require('fastclick');
FastClick.attach(document.body)

window.IScroll = require('iscroll/build/iscroll-probe')
window.globalSession = require('Utils/globalSession')

// 全局需要的一些文件
window.axios = require('axios')
window.Vue = require('vue')
window.Vuex = require('vuex')

import VueRouter from 'vue-router';
window.VueRouter = VueRouter;

// 文件上传压缩
require('lrz');

// 插件
// window.Vuelidate = require('vuelidate');

//vbus 全局事件
GLOBAL.vbus = window.vbus = new Vue()
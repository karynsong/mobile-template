import App from './app'
import store from 'Store'
// 配置相关
import routes from 'Config/router'
import 'Config/ajax'
import 'Config/wxcfg'
import { DEBUG } from 'Config/index'
// END 配置相关

import './directive/index'
// 引入全局组件注册
import 'Components/common'
// END 引入全局组件注册

// 全局的工具函数
import 'Utils/beacon';
// END 全局的工具函数

// 引入插件
import AjaxPlugin from 'Widget/ajax'
import Tools from 'Widget/tools'
import Share from 'Widget/share'
// END 引入插件

Vue.use(VueRouter);
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
Vue.use(AjaxPlugin);
Vue.use(Tools);
Vue.use(Share);

// 页面切换动画的补充
import { beforeEach } from 'Utils/pageAnimate'
var router = new VueRouter({
    routes,
    waitForData: true,
    transitionOnLoad: true
});
router.beforeEach(beforeEach);
window.$router = router;

// 微信认证需要绑定事件
GLOBAL.vbus.$on('WXConfigReady', () => {
    new Vue({
        store,
        router,
        el: '#app',
        render: h => h(App)
    });
});

// vue debug
Vue.config.debug = DEBUG.v_debug;

Vue.config.devtools = DEBUG.v_devtools;
//微信可视化console
DEBUG.vconsole && require('vconsole');
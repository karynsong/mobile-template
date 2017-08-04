import monitor from 'Utils/monitor';
import globalContext from 'Utils/globalContext';
import globalSession from 'Utils/globalSession';
import { forward, back } from 'Utils/pageAnimate'

document.setTitle = function(t) {
    document.title = t;
    if ((/iphone|ipad/gi).test(window.navigator.appVersion)) {
        var i = document.createElement('iframe');
        i.src = 'https://m.baidu.com/favicon.ico';
        i.style.display = 'none';
        i.onload = function() {
            setTimeout(function() {
                i.remove();
            }, 9);
        };
        document.body.appendChild(i);
    }
};

const getChildIscroll = ($vue) => {
    var _iscroll = [];
    if($vue.$config.hasScroll){
        _iscroll = _iscroll.concat($vue.$config.scrollArr);
    }
    $vue.$children.map(item => {
        if(item.$children && item.$children.length){
            _iscroll = _iscroll.concat(getChildIscroll(item));
        }
        if(item.$config.hasScroll){
            _iscroll = _iscroll.concat(item.$config.scrollArr);
        }
    });
    return _iscroll;
}

const getAllIscroll = function(){
    var $parent = this.$parent;
    if(this.$options.pageInfo){
        return getChildIscroll(this);
    }
    while (!$parent.$options.pageInfo) {
        $parent = $parent.$parent;
    }
    return getChildIscroll($parent)
}

// AjaxPlugin
export default {
    install: (Vue, options) => {
        Vue.mixin({
            beforeCreate () {
                if(this.$router){
                    this.$router.back = back;
                    this.$router.forward = forward;
                }
                
                this.$config = this.$options.$config || {};
                if(this.$config.hasScroll){
                    this.$config['scrollArr'] = [];
                }
                if(this.$options.pageInfo){
                    let pageInfo = this.$options.pageInfo;
                    // 设置标题
                    pageInfo && document.setTitle(pageInfo.title || '京医通');
                }
            },

            mounted() {
                var $config = this.$config;
                if($config.hasScroll){
                    $config['scrollerTimer'] = setInterval(() => {
                        $config['scrollArr'].map((item) => {
                            item.refresh && item.refresh();
                        });
                    }, 5000);
                }
            },

            destroyed () {
                var $config = this.$config;
                if($config.hasScroll){
                    $config.scrollArr.map((item) => {
                        item.destroy && item.destroy()
                    });
                    $config.scrollArr = [];
                    $config.scrollerTimer && clearInterval($config.scrollerTimer);
                }
            }
        });

        // 记录监控
        Vue.prototype.$monitor = function (type, monitorData) {
            monitor(type, monitorData)
        }

        // 调用 localstorage
        Vue.prototype.$globalContext = globalContext;

        // 调用 localstorage
        Vue.prototype.$globalSession = globalSession;

        // 禁止当前页面所有的 iscroll
        Vue.prototype.$scrollDisable = function() {
            var scrollArr = getAllIscroll.call(this);
            if(scrollArr && scrollArr.length){
                scrollArr.map((item) => {
                    item.disable && item.disable()
                });
            }
        }

        // 滚动当前页面所有的 iscroll
        Vue.prototype.$scrollAble = function() {
            var scrollArr = getAllIscroll.call(this);
            if(scrollArr && scrollArr.length){
                scrollArr.map((item) => {
                    item.enable && item.enable()
                });
            }
        }

        // 禁止当前页面所有的 iscroll
        Vue.prototype.$scrollRefresh = function() {
            var scrollArr = getAllIscroll.call(this);
            if(scrollArr && scrollArr.length){
                this.$nextTick(() => {
                    scrollArr.map((item) => {
                        item.refresh && item.refresh()
                    });
                });
            }
        }

        // 设置头部样式
        Vue.prototype.$setTitle = function(title) {
            if(title){
                this.$options.pageInfo.title = title;
                document.setTitle(title);
            }
        };
    }
}
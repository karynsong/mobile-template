import { WXCONFIG } from 'Config/index';

;(function() {
    // 如果不需要wxconfig直接触发
    GLOBAL.useInfo = {};
    if (!WXCONFIG) {
        setTimeout(() => {
            GLOBAL.vbus.$emit('WXConfigReady')
        })
        return
    }
    GLOBAL.ajax.get('/mobile/wx/conf/getWxConf',{
        params: {
            url: location.href.split('#')[0]
        }
    }).then((data) => {
        var cfg = data;
        cfg.jsApiList = ['scanQRCode', 'previewImage', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'hideOptionMenu', 'showOptionMenu', 'chooseWXPay', 'closeWindow', 'chooseImage', 'uploadImage'];
        cfg.debug = false;
        if (typeof WeixinJSBridge == 'undefined') {
            document.addEventListener('WeixinJSBridgeReady', BridgeReady, false);
        } else {
            BridgeReady();
        }
        wx && wx.config(cfg);
        GLOBAL.useInfo = {
            userId: data.userId,
            openId: data.openId
        }
        function BridgeReady() {
            setTimeout(() => {
                GLOBAL.vbus.$emit('WXConfigReady')
            })
        }
    }, (error) => {
        if (error.resCode === 101) {
            // 线上真机跳转时 hash 会丢掉
            // 将 hash 存在 URL 上当做参数
            // 跳转到 / 页面之后再做一次对应的跳转
            location.href = '/mobile/wx/accredit/go?new=' + encodeURIComponent(location.pathname.slice(1) + '?hash=' + encodeURIComponent(encodeURIComponent(location.hash)));
        }
    });
})()

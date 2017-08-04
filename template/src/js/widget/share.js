import _assign from 'lodash/assign';
import { WXCONFIG } from 'Config/index';

const sendLog = (shareKey, type, success, extraData) => {
    var _extra = {
        extra_d: success
    }
    if(extraData){
        _assign(_extra, extraData);
    }
    $Beacon(shareKey, type, _extra);
}

const cfg = {
    title: '京医通',
    imgUrl: 'https://img.benmu-health.com/wechat/jyt.jpg'
}

const share = (info) => {
    var title = info.title || cfg.title,
        iconUrl = info.iconUrl || cfg.imgUrl,
        link = info.link,
        desc = info.desc,
        shareKey = info.shareKey,
        extraData = info.extraData;
    wx.ready(() =>{
        wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: link, // 分享链接
            imgUrl: iconUrl, // 分享图标
            success: function () {
                sendLog(shareKey || info.title, 'MOMENTS', true, extraData);
            },
            cancel: function () {
                sendLog(shareKey || info.title, 'MOMENTS', false, extraData);
            }
        });
        wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接
            imgUrl: iconUrl, // 分享图标
            success: function () {
                sendLog(shareKey || info.title, 'CHAT', true, extraData);
            },
            cancel: function () {
                sendLog(shareKey || info.title, 'CHAT', false, extraData);
            }
        });
    })
}

// AjaxPlugin
export default {
    install: (Vue, options) => {
        Vue.mixin({
            created: function () {
                if(WXCONFIG && this.$options.pageInfo){
                    let pageInfo = this.$options.pageInfo;
                    pageInfo.showOptionMenu ? wx.showOptionMenu() : wx.hideOptionMenu();
                    pageInfo.shareInfo && share(pageInfo.shareInfo);
                }
            }
        });

        Vue.prototype.$changeShareInfo = function (shareInfo) {
            if(WXCONFIG && shareInfo){
                wx.showOptionMenu();
                share(shareInfo);
            }
        }
    }
}
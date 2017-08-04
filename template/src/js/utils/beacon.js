import _assign from 'lodash/assign';
import _isObject from 'lodash/isObject';
import GlobalContext from 'Utils/globalContext';

var MAXLENGTH = 0,
    APPNAMR = 'fe',
    BUSINESS = 'beacon',
    TYPE = 'wechatNew',

    ISPROD = location.href.indexOf('wechat.benmu-health.com') !== -1,
    BEACONURL = 'https://metatron.benmu-health.com/recorder/recordList.do';

/*
    type: ''        // 业务类型默认为 wechatNew
    page: ''        // 非必传 默认是当前页面的 document.title
    name: ''        // 必传 记录数据的名称
    extra_a: ''     // 非必传 openId
    extra_b: ''     // 非必传 userId
    extra_c: ''     // 非必传 时间戳
    extra_d: ''     // 非必传 额外的参数
    extra_e: ''     // 非必传 额外的参数
    extra_f: ''     // 非必传 额外的参数
    extra_g: ''     // 非必传 额外的参数
*/

export default function Beacon(name, page, extra) {
    if (!ISPROD || !name) {
        return;
    }

    if (_isObject(page)) {
        extra = page;
        page = '';
    }
    var data = {},
        _sendData = GlobalContext.get('beaconCache');
    if (!_sendData) {
        _sendData = [];
    }
    data['type'] = TYPE;
    data['page'] = page || document.title;
    data['name'] = name;
    data['extra_a'] = GLOBAL.useInfo.openId || '';
    data['extra_b'] = GLOBAL.useInfo.userId || '';
    data['extra_c'] = +new Date();
    _assign(data, extra);

    _sendData.push(data);
    if (_sendData.length > MAXLENGTH) {
        GLOBAL.ajax({
            method: 'post',
            url: BEACONURL,
            data: _sendData,
            params: {
                app: APPNAMR,
                business: BUSINESS
            }
        });
        _sendData = [];
    }
    GlobalContext.set('beaconCache', _sendData);
}
window.$Beacon = Beacon;
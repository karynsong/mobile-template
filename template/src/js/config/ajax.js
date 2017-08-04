/**
 * 文档地址https://github.com/mzabriskie/axios
 * ajax为axios的实例
 */
import {
    LOGINCODE,
    DEBUG,
    AJAXTIMEOUT
} from 'Config/index';
import monitor from 'Utils/monitor';
import getParamsToken from 'Utils/token';

// 过滤的 URL 下面这些 URL 返回的错误不处理
const filterUrl = [
    // 打点
    'metatron.benmu-health.com',
    // 监控
    '/proxy/receiveList'
]

// 需要做前后端 token 加密的 URL
const tokenList = [];

GLOBAL.ajax = axios.create({
    // baseURL: TESTPATH, //调试本地开启
    timeout: AJAXTIMEOUT //超时时间 nms后自动abort
})

// request 拦截器
GLOBAL.ajax.interceptors.request.use(function(config) {
    // 请求带上时间
    var d1 = +new Date;
    if (!config.params) {
        config.params = {};
    }
    config.params._ = d1;
    if (tokenList.indexOf(config.url) !== -1) {
        var sendOpts = getParamsToken({
            url: config.url,
            type: config.method,
            data: config.params
        });
        config.url = sendOpts.url;
        config.params = sendOpts.data;
    }
    DEBUG.req && console.info(config.url, ' request:', config)
    return config;
}, function(error) {
    DEBUG.req && console.error('request_error', error)
    return Promise.reject(error);
});

// response 拦截器
GLOBAL.ajax.interceptors.response.use(function(response) {
    var request_url = response.config.url,
        hasFilterUrl = filterUrl.some(item => {
            if (request_url.indexOf(item) !== -1) {
                return true
            }
        });
    if (hasFilterUrl) {
        return;
    }
    monitor('time', {
        name: 'API_TIME',
        alias: '接口时间',
        time: +new Date() - response.config.params._,
        path: request_url
    });
    DEBUG.res && console.info(response.config.url, ' response:', response);
    //resCode全局处理
    var resData = response.data,
        resCode = resData.resCode;
    if (resCode === 0) {
        return resData.data;
    } else if (resCode === 101) {
        // 线上真机跳转时 hash 会丢掉
        // 将 hash 存在 URL 上当做参数
        // 跳转到 / 页面之后再做一次对应的跳转
        location.href = '/mobile/wx/accredit/go?new=' + encodeURIComponent(location.pathname.slice(1) + '?hash=' + encodeURIComponent(location.hash));
        // 未授权错误直接吞掉
        // return Promise.reject(resData);
    } else if (resCode === LOGINCODE) {
        $loading && $loading.hide();
        GLOBAL.vbus.$emit('goLogin');
        // 未登陆错误直接吞掉
        // return Promise.reject(resData);
    } else {
        !response.config.noShowDefaultError && GLOBAL.vbus.$emit('ajax_error', resData);
        $loading && $loading.hide();
        return Promise.reject(resData);
    }
}, function(error) {
    var url = error && error.config && error.config.url,
        hasFilterUrl = filterUrl.some(item => {
            if (url.indexOf(item) !== -1) {
                return true
            }
        });
    if (hasFilterUrl) {
        return;
    }
    if (error.config && error.message !== 'CANCEL') {
        var request = error.config,
            time = +new Date() - request.params._;
        if (error.response && error.response.status == 404) {
            monitor('time', {
                name: 'API_FAIL',
                alias: '接口失败',
                time: time,
                path: request.url
            });
        } else {
            monitor('time', {
                name: 'API_TIMEOUT',
                alias: '接口超时',
                time: time,
                path: request.url
            });
        }
    }
    $loading && $loading.hide();
    DEBUG.res && console.error('response_error', error)
    GLOBAL.vbus.$emit('ajax_error');
});
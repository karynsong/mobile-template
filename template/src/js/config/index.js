// 独立开发时，mock 服务的路径
export const TESTPATH = '//fe.benmu-health.com'
    // 接口拦截到需要跳转登录页面的 code
export const LOGIN_CODE = 102
    // 需要微信认证
export const WXCONFIG = false
    // 请求超时时间
export const AJAXTIMEOUT = 20000
    // 请求是否会发送本地的请求
export const LOCAL_AJAX = false


/**
 * 开启项目调试
 * @type {Boolean}
 * 控制台打印 请求 响应 请求报错 响应报错
 * 开启vue调试 开启vconsole工具
 * 有待补充
 */
export const DEBUG = {
    // 请求打印
    req: false,
    // 响应打印
    res: false,
    //开启vconsole
    vconsole: false,
    // 开启vue debug
    v_debug: true,
    // 开启vue devtools
    v_devtools: true
}
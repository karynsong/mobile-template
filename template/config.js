/**
 * @Author: songqi
 * @Date:   2017-02-06
 * @Last modified by:   songqi
 * @Last modified time: 2017-02-22
 */

module.exports = {
    'frame': 'frameName',
    'server': {
        'path': '../',
        'port': 80
    },
    'proxy': [{
        'route': '/test',
        'target': '127.0.0.1:52077/test'
    }],
    'mockServer': {
        'port': 52077,
        'mockDir': './dist/mock'
    },
    'openPath': 'http://fe.benmu-health.com/mobile-template/dist/html/#/data.home',
    'exports': [
        /************
         ** 业务资源 **
         *************/
        'css/main.scss',
        'css/baseLibs/ionic.css',
        'js/vendor.js',
        'js/main.js'
    ],
    'vue2': true,
    'alias': {
        'Components': 'js/components',
        'BaseLibs': 'js/baseLibs',
        'Common': 'js/common',
        'Config': 'js/config',
        'Widget': 'js/widget',
        'Pages': 'js/pages',
        'Utils': 'js/utils',
        'Store': 'js/store',
        'Service': 'js/service'
    }
};
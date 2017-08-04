export default function getphoneModel() {
    var Windows = {
        Win2K: {
            edition: 'Windows NT 5.0',
            model: 'Windows 2000'
        },
        WinXP: {
            edition: 'Windows NT 5.1',
            model: 'Windows XP'
        },
        Win2003: {
            edition: 'Windows NT 5.2',
            model: 'Windows 2003'
        },
        WinVista: {
            edition: 'Windows NT 6.0',
            model: 'Windows Vista'
        },
        Win7: {
            edition: 'Windows NT 6.1',
            model: 'Windows 7'
        }
    };

    var iPhone = {
        isPho4: {
            width: 320,
            height: 480,
            model: 'iPhone 4'
        },
        isPho5: {
            width: 320,
            height: 568,
            model: 'iPhone 5'
        },
        isPho6: {
            width: 375,
            height: 667,
            model: 'iPhone 6+'
        },
        isPho6P: {
            width: 414,
            height: 736,
            model: 'iPhone 6P+'
        }
    };

    //获取用户代理
    var ua = navigator.userAgent;
    // if (ua.indexOf('Mac') != -1) return { type: 'Mac' };
    if (ua.indexOf('wechatdevtools') != -1) return { type: '微信web开发工具' };
    if (ua.indexOf('iPad') != -1) return { type: 'iPad' };
    if (ua.indexOf('Windows') != -1) {
        for (var n in Windows) {
            if (ua.indexOf(Windows[n]['edition']) != -1) {
                return {
                    type: 'windows',
                    model: Windows[n]['model']
                };
            }
        }
    }
    if (ua.indexOf('iPhone') != -1) {
        var iPhoneH = screen.height,
            iPhoneW = screen.width,
            system = '';
        for (var i in iPhone) {
            // 竖屏、横屏
            if (iPhone[i]['width'] == iPhoneW && iPhone[i]['height'] == iPhoneH ||
                iPhone[i]['width'] == iPhoneH && iPhone[i]['height'] == iPhoneW) {
                var system1 = ua.match(/OS [0-9]+_\d[_\d]* like Mac OS X/i);
                var system2 = system1[0].slice(0, system1[0].indexOf('like'));
                system = 'i' + system2.replace('_', '.');
                return {
                    type: 'iPhone',
                    system: system,
                    model: iPhone[i]['model']
                };
            }
        }
    }
    if (ua.indexOf('Linux') != -1) {
        var index = ua.indexOf('Android');
        if (index != -1) {
            //os以及版本
            var system = ua.slice(index, index + 11);
            var _model = ua.split(';')[2];
            //手机型号
            var index2 = _model.indexOf('Build');
            var model = _model.slice(0, index2);
            return {
                type: 'Android',
                system: system,
                model: model
            };
        } else {
            return {
                type: 'Linux'
            };
        }
    }

    return {
        type: '未知操作系统'
    };
};
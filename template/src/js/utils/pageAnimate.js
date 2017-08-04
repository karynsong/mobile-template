// const sess = {
//     get(name) {
//         let value = sessionStorage.getItem(name)
//         if (/^\{.*\}$/.test(value)) value = JSON.parse(value)
//         return value
//     },
//     set(name, value) {
//         if (typeof value === typeof {}) value = JSON.stringify(value)
//         return sessionStorage.setItem(name, value)
//     },
//     remove(name) {
//         return sessionStorage.removeItem(name)
//     }
// }

// const beforeEach = (toRoute, fromRoute, next) => {
//     const to = toRoute.path
//     const from = fromRoute.path
//     const scrollTop = VonicSrc.app.pageContentScrollTop()
//     let h = sess.get(to)
//     if (h && h.history) {
//         VonicSrc.app.nextDirection('back')
//         h.history = false
//         sess.set(to, h)
//     } else {
//         sess.set(from || '/', {
//             history: true,
//             scrollTop: scrollTop
//         })
//         VonicSrc.app.nextDirection('forward')
//     }

//     // 某些页面定制 page transition direction
//     if ((from == '/' && to == '/home')) {
//         VonicSrc.app.nextDirection('forward')
//     }

//     if ((to == '/' && from == '/home')) {
//         VonicSrc.app.nextDirection('back')
//     }
//     next()
// }

// const afterEach = (toRoute, fromRoute) => {
//     const to = toRoute.path
//     const from = fromRoute.path
//     // [Custom Business] Never use history scrollTop when '/' => '/home'
//     if (from == '/' && to == '/home') return

//     const h = sess.get(to)
//     if (h && h.scrollTop) {
//         Vue.nextTick(() => {
//             VonicSrc.app.pageContentScrollTop(h.scrollTop)
//             GLOBAL.vbus.$emit('hideLogin');
//         });
//     }
// }

// 另一种动画过度的方式
import _cloneDeep from 'lodash/cloneDeep';
import gloabalSession from 'Utils/globalSession';

var _nextDirection = '',
    _history = gloabalSession.get('BMHistory') || [];

const nextDirection = (direction) => {
    let el = document.querySelector('[benmu-app]');
    if (el) el.setAttribute('page-direction', direction);
}

export const forward = function(route) {
    _nextDirection = 'forward';
    this.push(route);
}

const getHostoryLen = (name) => {
    var index = 1,
        $history = _cloneDeep(_history);
    $history.reverse().some((item, _index) => {
        if (item.to === name) {
            index = _index * -1;
            return true;
        }
    });
    return index;
}

export const back = (route) => {
    var _route = route || {},
        name = _route.name,
        length = _route.length || -1;

    if (name) {
        length = getHostoryLen(name);
    }
    _nextDirection = 'back';
    history.go(length);
}

const hideKeyboard = () => {
    var inputs = document.querySelectorAll('input'),
        inputsLen = inputs.length;
    for (var i = inputsLen; i--;) {
        inputs[i].blur();
    }
}

var moveTimes = 0;
document.ontouchstart = function(e) {
    moveTimes = 0;
};

document.ontouchmove = function(e) {
    ++moveTimes;
    e.preventDefault();
};


export const beforeEach = (to, from, next) => {
    if (from.name === to.name) {
        return;
    }

    // 统一设置渠道
    if (!to.query.channel) {
        to.query.channel = from.query.channel;
    }

    // 统一设置 from 参数
    if (!to.query.from) {
        to.query.from = from.name;
    }

    if (to.meta.pvKey) {
        $Beacon(to.meta.pvKey, from.name);
    }

    // 防止动画还在执行
    TweenMax.killAll();
    
    // 清楚页面间过度的 loading
    $loading && $loading.hide(true);
    // 隐藏键盘
    hideKeyboard();

    var historyIndex = getHostoryLen(to.name);
    if (!_history.length || _nextDirection === 'forward') {
        _history.push({
            to: to.name,
            from: from.name
        });
        _nextDirection = 'forward';
    } else if (historyIndex === -1 || _nextDirection === 'back') {
        _history = _history.slice(0, historyIndex);
        if (moveTimes === 0) {
            _nextDirection = 'back';
        }
        GLOBAL.vbus.$emit('hideLogin');
        try {
            document.setTitle(to.matched[0].instances.default.$options.pageInfo.title || '京医通')
        } catch (error) {
            $Beacon('jsError', {
                extra_d: '返回设置标题失败'
            });
        }
    } else if (historyIndex === 1) {
        _history.push({
            to: to.name,
            from: from.name
        });
    }
    nextDirection(_nextDirection);
    _nextDirection = '';
    gloabalSession.set('BMHistory', _history);

    next();

    if (to.meta.needLogin && !GLOBAL.useInfo.userId) {
        setTimeout(() => {
            GLOBAL.vbus.$emit('goLogin');
        });
    }
};
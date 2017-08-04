/*
放入各种兼容性奇淫技巧
 */

/**
 * iscroll 点击事件 不同移动端的兼容
 * @return {[type]} [点击类型]
 */
export const iscrollClickHack = () => {
    if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
    if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
    if (/Silk/i.test(navigator.userAgent)) return false;
    if (/Android/i.test(navigator.userAgent)) {
        var s = navigator.userAgent.substr(navigator.userAgent.indexOf('Android') + 8, 3);
        return parseFloat(s[0] + s[3]) < 44 ? false : true;
    }
}

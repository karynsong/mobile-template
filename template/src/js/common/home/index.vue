<template>
    <div></div>
</template>
<script>
// 这个页面不允许写任何逻辑
// 改页面主要用于中转页面首次打开的认证服务
// 微信认证，在线上真机不会跳转到对应的页面，所以做的 hack
import { getQueryString } from 'Utils/url';
export default {
    created(){
        var hash = getQueryString('hash').replace(/^\#\//g, '');
        if(hash){
            // 修改了 query 次所以会多一次跳转
            // location.replace(location.origin + location.pathname + decodeURIComponent(hash));
            location.href = location.href + hash;
        }
    }
}
</script>

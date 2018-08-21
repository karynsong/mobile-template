## 使用安装
测试分支
权限不足请使用 sudo

BM init -f mobile
创建名称
版本
cnpm install

### 功能介绍

移动端底层已经切换至 vnoic，基于 WeUI，vnoic 又在此之上封装了很多，能很快的构建业务

对于 vnoic 服务指令的引入最好在 common 中进行引入，尽量减小包的体积，按需再向整个业务进行引用

### 目录结构

    ·
    |-- .gitignore          （需要忽略的文件：/node_modules、/bower_components、/dist）
    |-- .babelrc            （babel 编译的文件）
    |-- .eslintrc           （js 语法检测文件）
    |-- config.js           （BM 配置文件）
    |-- node_modules        （node 依赖）
    |-- html                （对外输出的页面文件）
    |-- dist                （对外输出的 js/css 资源文件）
    |-- src                 （工程目录）
        |-- css                 （css 文件目录）
        |-- html                （html 文件目录）
        |-- mock                （mock）
        |-- js                  （js 文件目录）
            |-baseLibs          （此文件一般是外部一些大型的资源文件，且这个文件不会走编译）
            |-common            （公共模块具有完整的页面周期的行为，如：登录）
            |-components        （全局公共组件）
            |-config            （公共配置文件：如路由等）
            |-pages             （页面的业务）
            |-service           （发送请求的服务方法）
            |-store             （全局的 store 如登录信息）
            |-utils             （工具类函数）
            |-widget            （全局生命周期插件）
            |-app.vue           （根节点）
            |-main.js           （业务的根节点 js）
            |-vendor.js         （公共的资源文件引入）

### 修改配置文件

修改文件目录中的```src\js\config\index.js```
``` javascript
// 独立开发时，mock 服务的路径
export const TESTPATH = '//fe.benmu-health.com'
// 接口拦截到需要跳转登录页面的 code
export const LOGIN_CODE = 1000
// 需要微信认证
export const WXCONFIG = true
// 请求超时时间
export const AJAXTIMEOUT = 20000
// 请求是否会发送本地的请求
export const LOCAL_AJAX = false

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
```
将上面的配置文件，配置成适用于当前项目的参数

### 启动

    BM server // 启动该项目，该项目会自动打开浏览器

## 规范

### 页面配置

在`vue`的组件化中，我们还是需要标识页面级别的组件，单页面的应用更需要设置`title`和`微信分享参数`，页面界别的`vue`文件中必须含有一个`pageInfo`。

``` javascript
pageInfo: {
    // 当前页面的标题
    title: '急诊地图',
    // 是否展示微信右上角的选项
    showOptionMenu: true,
    // 分享信息
    shareInfo: {
        // 分享需要记录的key
        shareKey: 'WX_JZDT0000002',
        // 分享的信息
        title: '【收藏文】原来急诊也要跑对医院',
        iconUrl: 'https://img.benmu-health.com/wechatV2/img/mapShare.jpg',
        link: 'https://wechat.benmu-health.com/wechatV2/#/hosMap.intro',
        desc: '患者在线可查询医院急诊项目范畴，获得精准救助'
    }
}
```

### `ajax 规范`

底层使用`axios`，需要了解`API`自行了解`axios`库，需要在`service`中配置好自己的请求发送参数如
``` javascript
{
    // 接口名称，调用时会用到，注意重复
    name: 'detail',
    // 发送请求类型
    method: 'GET',
    // 接口描述
    desc: '医生个人信息接口',
    // 本地地址
    localPath: '/test/sectionDoctor/detail',
    // 线上地址
    path: '/mobile/wx/individualDoc/queryById',
    // 发送出去的参数
    params: {
        key: value
    }
}

```
业务中调用方式
``` javascript
this.$service['xxx/detail']({
    key: value
}, {
    // 额外的参数 如：header
    noShowDefaultError: true
}).then((data) => {
    // 已经过滤了 resData.data，可直接使用，无需判断
    // 具体的过滤器在 config/ajax 中
}, () => {
    // 失败的回调，错误已经自动报了，一般无需关心
});
```

### `router` 命名规范

命名尽量遵循`父级路由.当前路由`的规则，一般路由路径不能超过三层，需要考虑效率问题

路由配置文件在 `config/router` 中，路由配置规则尽量遵循父子路由的关系，子路由都配置在父路由的 `children` 属性中，配置自路由的好处是在打开子路由返回的时候，父级路由的转台都还保存着

订单模块，有搜索条件的页面，搜索结果列表页面，搜索详情页面，构造出来的路由如下：
``` javascript
{
    path: '/order',
    component: Order,
    children: [{
        path: '/search',
        component: Search
    },{
        path: '/list',
        component: List,
        children: [{
            path: '/detail',
            component: Detail
        }]
    }]
}
```

父路由中模板文件也需要增加对应的自路由组件

``` javascript
<transition name="child">
    <router-view></router-view>
</transition>
```

路由中的`channel`和`from`参数会自动带到下一个页面，这个是为了每个业务自动记录当前业务的渠道

router 配置中还有有一些默认的 meta 参数

``` javascript
{
    name: '',
    path: '',
    component: ,
    meta: {
        // 页面是否需要登录，如果需要登录且没有获取到用户登录信息就会弹到登录页面，登录成功之后自动返回
        needLogin: true,
        // 当前页面的 pv 统计参数
        pvKey: 'WX_JZDT0000003'
    }
}
```

下面是业务中新开页面和返回页面的使用：

``` javascript
this.$router.forword({
    // 不要路径，一般都写 name
    name: ''
})

// 默认返回一步
this.$router.back() === history.go(-1)

// 多级返回
this.$router.back({
    // name，返回到堆栈中最近的一个 name 路由
    name: ''
    // length 代表返回的路径长度
    length: ''
})
```

页面路由切换代码

### `store` 文件夹下命名规范

我们的 `store` 的命名规范基本上是围绕着 `pages` 来做的，`pages` 确定之后，其实 `store` 就已经确定了。全局的`store`是放在根目录下的`store`里的，其他的业务`store`都是跟着业务走的

使用都是跟着路由的生命周期完成的，这里并不是真正的把`store`移除，实质上只是在当前的`store`树上解除了引用关系，下来再次加回来的时候状态都还在。如果想要每次都是新的状态，应该在`state`的声明的时候返回一个纯函数，每次使用的时候都是新的状态。

``` javascript
beforeRouteEnter(to, from, next) {
    store.install()
    next()
},
beforeRouteLeave(to, from, next) {
    store.uninstall()
    next()
}
```

### `actions` 命名规范

由于项目中的 `store` 是合并到一个 `store` 上，获取 `actions` 的方式又是通过 `mapActions`，所以需要做好命名的区分。

一般我们是用，由于有命名空间，在多个模块间共用的`actions`不能重复:

    DO_something	GET_HOSLIST

### `getter` 命名规范

由于项目中的 `store` 是合并到一个 `store` 上，获取 `getter` 的方式又是通过 `mapGetters`，所以需要做好命名的区分

有了命名空间，一般是不会重复，一般我们是用:

	...mapGetters('tab', ['activeTab', 'showMask'])

### `pages` 文件夹下命名规范

我们认为 `pages` 下的子模块是遵循某种模块划分的，这样会更有利于之后维护代码，所以一般我们在 `pages` 下建立模块的时候一般是遵循以页面来划分。
那么 `pages` 下的目录结构其实就是后台功能菜单栏功能目录的一种体现。

比如有一个目录结构是：

    医院管理
        医院列表

对应的 `page` 下的文件目录结构就应该类似如下（我的英语不好，只能下面这样翻译了）：

	hosManager
		hosList

上面这种这是模块划分映射目录划分的一种方式，我们还可以依照功能去划分，这样划分可能需要有更强的语义性

### 模块的构成

当划分出一个子模块之后，我们不能简单粗暴的用一个 `.vue` 文件把所有业务逻辑完成，除非你的模块功能非常单一，其他的情况，我们希望把模块进行划分，由多个子 `component` 组成，划分的粒度也需要自己掌握，粒度越细越灵活，但也意味着 `component` 间的交互会变得复杂。

比如我们划分出了三个模块 `header`、`list`、`footer`，我们的目录结构按照上面的继续写就会是

``` javascript
	hosManager
		hosList
			index.vue
            store
                index.js
                actions.js
                modules
                    header.js
                    list.js
                    footer.js
            components
                header.vue
                list                // 如果业务非常复杂可做一下拆分
                    index.vue		// 参照 vue2 官网说明，这个文件是作为引入其他文件存在
                    index.js	    // js 逻辑文件
                    index.scss		// 样式文件
                    index.html		// html 文件
                footer.vue
```

`hosList/index.vue` 仅仅是作为组织文件，将三个子模块引入，并且做好架子的角色，如 `html` 中的布局，如果 `component` 间需要事件交互，这个文件也可以充当中介者的角色。

### `scroll` 的使用

`iscroll`放到统一的数组中，主要是因为每隔几秒需要更新，以防微信修改大字体。并且可以在某些情况下直接禁用当前页面所有的 `iscroll`，比如弹窗

``` javascript
$config: {
    // 标志当前业务中有 iscorll
    hasScroll: true,
},
methods: {
    // iscroll 刷新
    refresh(){
        this.$scrollRefresh();
    },
    // iscroll 启用
    able(){
        this.$scrollAble();
    },
    // iscroll 禁用
    disable(){
        this.$scrollDisable();
    }
},
mounted () {
    // scroll 使用的时候需要
    this.$config.scrollArr.push(new IScroll(el, {
        preventDefault: false,
    }));
}
```

### `beacon` 的使用

发送`beacon`记录打点，发送到`hive`中，各业务再去找对应的后端做查询，具体文件在`utils/beacon.js`

``` javascript
$Beacon(key, page(可缺省), {
    // 保留参数，没有特殊需求这些参数不能覆盖 openId  userId  时间戳
    extra_[a-e]: '额外参数'
    // 额外需要记录的数据
    extra_[d-g]: '额外参数'
});

$Beacon('WX_DLZC0000005');
$Beacon('WX_DLZC0000005', '登录页', {
    extra_d: '注册业务'
});
$Beacon('WX_DLZC0000005', {
    extra_d: '注册业务'
});
```

## `vue` 使用规范

### 组件交互
兄弟组件

    父组件向子组件传递数据:
    props

    子组件向父组件抛出事件:
    vm.$emit('xxx')

    父组件用v-on:xxx="func"来接子组件触发的事件和暴露的数据

虽然vue还提供了`$ref`和`$parent`来让我们访问其他组件的数据和方法，但为了工程的可维护性，让我们的数据变化的追踪变得有规律可循，我们应尽量避免他们的使用

非兄弟组件
有时候非父子关系的组件也需要通信。在简单的场景下，使用一个空的 `Vue 实例作为中央事件总线`

业务简单:

    var bus = new Vue()

    // 触发组件 A 中的事件
    bus.$emit('id-selected', 1)

    // 在组件 B 创建的钩子中监听事件
    bus.$on('id-selected', function (id) {
    // ...
    })

业务复杂:

    请直接使用Vuex
    actions中只做异步和分发
    commit应该按state结构来细分 尽量避免一个commit修改多个state

## 格式

如果不给代码做格式化就是等于代码没有写。请原谅我是 tab = 4空格档，就必须是这样的

## 其他还没有想好，支持一切新的属性，你可以尽情的使用

## 数组

### 向数组增加元素时使用 Array#push 来替代直接赋值。
```javascript
  var someStack = [];
    // bad
    someStack[someStack.length] = 'abracadabra';
    // good
    someStack.push('abracadabra');
```
ps：尽量不要频繁取值。

### 当你需要拷贝数组时，使用 Array#slice
```javascript
    var item = [1,2,3];
    var item_len = item.legth;
    var itemArr = [];
    var i = '';
    // bad
    for(i = 0; i < item_len; i++){
        itemArr[i] = item[i];
    }
    // good
    itemArr = item.slice();
```
### 使用 Array#slice 将类数组对象转换成数组
```javascript
    function trigger() {
      var args = Array.prototype.slice.call(arguments);
      ...
}
```

## 字符串

### 使用单引号，包引字符串
``` javascript

var str = 'helloe world!';

```

### 超过 100 个字符的字符串应该使用连接符写成多行。
```javascript
var str = '<p>你好</p>'+
        '<p>你好<p>'+
        '<p>你好</p>';

```
ps：尽量用“+”，不用“\”，若字符很长，需折行，不用折行，会影响性能读取问题。

### 程序化生成的字符串使用 Array#join 连接而不是使用连接符。尤其是 IE 下
```javascript
    for (i = 0; i < length; i++) {
        //bad
        items += '<li>' + messages[i].message + '</li>';
        //good
        items[i] = '<li>' + messages[i].message + '</li>';
    }

    //bad
        return '<ul>' + items + '</ul>';
    //good
        return '<ul>' + items.join('') + '</ul>';
```
ps：for循环，length提前取出。


```javascript
{
    "rules": {
        //官方文档 http://eslint.org/docs/rules/
        //参数：0 关闭，1 警告，2 错误

        // "quotes": [0, "single"],                  //建议使用单引号
        // "no-inner-declarations": [0, "both"],     //不建议在{}代码块内部声明变量或函数
        "no-extra-boolean-cast": 1, //多余的感叹号转布尔型
        "no-extra-semi": 1, //多余的分号
        "no-extra-parens": 0, //多余的括号
        "no-empty": 1, //空代码块
        "no-use-before-define": [0, "nofunc"], //使用前未定义
        "complexity": [1, 10], //圈复杂度大于10 警告

        //常见错误
        "comma-dangle": [1, "never"], //定义数组或对象最后多余的逗号
        "no-debugger": 1, //debugger 调试代码未删除
        "no-console": 0, //console 未删除
        "no-constant-condition": 2, //常量作为条件
        "no-dupe-args": 2, //参数重复
        "no-dupe-keys": 2, //对象属性重复
        "no-duplicate-case": 2, //case重复
        "no-empty-character-class": 2, //正则无法匹配任何值
        "no-invalid-regexp": 2, //无效的正则
        "no-func-assign": 2, //函数被赋值
        "valid-typeof": 1, //无效的类型判断
        "no-unreachable": 2, //不可能执行到的代码
        "no-unexpected-multiline": 2, //行尾缺少分号可能导致一些意外情况
        "no-sparse-arrays": 1, //数组中多出逗号
        "no-shadow-restricted-names": 2, //关键词与命名冲突
        "no-undef": 0, //变量未定义
        "no-unused-vars": 1, //变量定义后未使用
        "no-cond-assign": 2, //条件语句中禁止赋值操作
        "no-native-reassign": 2, //禁止覆盖原生对象
        "no-mixed-spaces-and-tabs": 0,

        //代码风格优化
        "no-irregular-whitespace": 0,
        "no-else-return": 0, //在else代码块中return，else是多余的
        "no-multi-spaces": 0, //不允许多个空格
        "key-spacing": [0, {
            "beforeColon": false,
            "afterColon": true
        }], //object直接量建议写法 : 后一个空格前面不留空格
        "block-scoped-var": 1, //变量应在外部上下文中声明，不应在{}代码块中
        "consistent-return": 1, //函数返回值可能是不同类型
        "accessor-pairs": 1, //object getter/setter方法需要成对出现
        "dot-location": [1, "property"], //换行调用对象方法  点操作符应写在行首
        "no-lone-blocks": 1, //多余的{}嵌套
        "no-empty-label": 1, //无用的标记
        "no-extend-native": 1, //禁止扩展原生对象
        "no-floating-decimal": 1, //浮点型需要写全 禁止.1 或 2.写法
        "no-loop-func": 1, //禁止在循环体中定义函数
        "no-new-func": 1, //禁止new Function(...) 写法
        "no-self-compare": 1, //不允与自己比较作为条件
        "no-sequences": 1, //禁止可能导致结果不明确的逗号操作符
        "no-throw-literal": 1, //禁止抛出一个直接量 应是Error对象
        "no-return-assign": [1, "always"], //不允return时有赋值操作
        "no-redeclare": [1, {
            "builtinGlobals": true
        }], //不允许重复声明
        "no-unused-expressions": [0, {
            "allowShortCircuit": true,
            "allowTernary": true
        }], //不执行的表达式
        "no-useless-call": 1, //无意义的函数call或apply
        "no-useless-concat": 1, //无意义的string concat
        "no-void": 1, //禁用void
        "no-with": 1, //禁用with
        "space-infix-ops": 0, //操作符前后空格
        "valid-jsdoc": [0, {
            "requireParamDescription": true,
            "requireReturnDescription": true
        }], //jsdoc
        "no-warning-comments": [1, {
            "terms": ["todo", "fixme", "any other term"],
            "location": "anywhere"
        }], //标记未写注释
        "curly": 0 //if、else、while、for代码块用{}包围
    },
    "env": {
        "es6": true,
        "node": true,
        "browser": true,
        "jquery": true
    },
    "parser": "babel-eslint",
    "ecmaFeatures": {
        "jsx": true
    },
    "plugins": [
        //"react",//写react安装该插件
        "eslint-plugin-html"
    ]
}
```


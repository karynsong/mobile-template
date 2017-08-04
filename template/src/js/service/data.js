export default [{
    name: 'isRegister',
    method: 'GET',
    desc: '查询是否注册',
    localPath: '/mobile/wx/user/signUp/status',
    path: '/mobile/wx/user/signUp/status',
    params: {
        phone: ''
    }
}, {
    name: 'register',
    method: 'GET',
    desc: '注册',
    localPath: '/mobile/wx/user/sign/up',
    path: '/mobile/wx/user/sign/up',
    params: {
        phone: '',
        password: '',
        verifyCode: ''
    }
},{
    name: 'relation',
    method: 'GET',
    desc: '绑定账户',
    localPath: '/mobile/wx/user/wxLogin/bindAccount',
    path: '/mobile/wx/user/wxLogin/bindAccount',
    params: {
        phone: '',
        unionId: '',
        nick: '',
        password: '',
        verifyCode: '',
    }
},{
    name: 'forget',
    method: 'GET',
    desc: '忘记密码',
    localPath: '/mobile/wx/user/pw/homeUpdate',
    path: '/mobile/wx/user/pw/homeUpdate',
    params: {
        newPw: '',
        verifyCode: '',
        phone: ''
    }
},{
    name: 'login',
    method: 'GET',
    desc: '登录',
    localPath: '/mobile/wx/user/sign/in',
    path: '/mobile/wx/user/sign/in',
    params: {
        phone: '',
        password: ''
    }
},{
    name: 'wechatLogin',
    method: 'GET',
    desc: '授权登录',
    localPath: '/mobile/wx/user/wxLogin',
    path: '/mobile/wx/user/wxLogin'
}]
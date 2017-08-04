// 校验方法查询
// http://www.lovebxm.com/2017/05/31/RegExp/

export const isPhone = (phone, context) => {
    if(!phone || phone.length !== 11){
        return false;
    }
    return true
}

export const isPassword = (password, context) => {
    if(password.length < 6 || password.length > 16){
        return false;
    }
    if(!/^[A-Za-z0-9]+$/.test(password)){
        return false;
    }
    return true
}
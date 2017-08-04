/**
* @Author: songqi
* @Date:   2017-05-04
 * @Last modified by:   sunwangxing
 * @Last modified time: 2017-05-17
*/

var md5 = require('md5'),
    _isUndefined = require('lodash/isUndefined');
/**
 * [getParamsToken 验签 hubi 写的逻辑]
 * @author songqi
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export default function getParamsToken(options) {
    var timestamp = options.data._ || +new Date(),
        sendParams = options.url + '?',
        params = {
            _: timestamp
        },
        keyArr = ['_'],
        paramsStr = '';
    if(options.type.toUpperCase() === 'POST' && options['data']){
        params['data'] = JSON.stringify(options['data']);
        keyArr.push('data');
    }else{
        for(var i in options.data){
            if(_isUndefined(params[i]) && !_isUndefined(options.data[i])){
                params[i] = options.data[i];
                keyArr.push(i);
            }
        }
    }
    keyArr.sort();
    keyArr.push('paterner_key');
    keyArr.map((item, index) => {
        paramsStr += item + '=';
        if(item === 'paterner_key'){
            paramsStr += timestamp.toString().slice(-6, -1);
        }else{
            paramsStr += decodeURIComponent(params[item]);
        }
        if(index !== keyArr.length - 1){
            paramsStr += '&';
        }
    });
    params['xa7w6pf'] = md5(paramsStr);
    if(options.type.toUpperCase() === 'POST' && params['data']){
        delete params['data'];
    }
    for(var j in params){
        sendParams += j + '=' + encodeURIComponent(decodeURIComponent(params[j])) + '&';
    }
    sendParams = sendParams.slice(0, sendParams.length - 1);
    if(options.type.toUpperCase() === 'POST'){
        return {
            url: sendParams,
            data: options.data
        };
    }
    return {
        url: sendParams
    };
}
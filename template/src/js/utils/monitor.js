/**
* @Author: songqi
* @Date:   2017-01-05
* @Last modified by:   songqi
* @Last modified time: 2017-06-12
*/

import GlobalContext from 'Utils/globalContext';

const APPNAMR = 'fe_wechat';
const MONITORURL = '/proxy/receiveList';
const MAXLENGTH = 5;

const Monitor = {
    _monitortime(monitorData){
        var sendData = monitorData.map(item => {
            return {
                app: APPNAMR,
                name: item.name,
                alias: item.alias || '',
                metricType: 'TIMER',
                host: '__wechat',
                tags: {},
                val: item.time
            }
        });
        GLOBAL.ajax({
            method: 'post',
            url: MONITORURL,
            data: sendData
        });
    },
    _monitorcount(name, alias, path){
        var sendData = monitorData.map(item => {
            return {
                app: APPNAMR,
                name: item.name,
                alias: item.alias || '',
                metricType: 'COUNTER_DELTA',
                host: '__wechat',
                tags: {},
                val: 1
            }
        });
        GLOBAL.ajax({
            method: 'post',
            url: MONITORURL,
            data: sendData
        });
    }
}

export default function monitor(type, monitorData){
    var _sendData = GlobalContext.get('monitor' + type);
    if(!_sendData){
        _sendData = [];
    }
    _sendData.push(monitorData);
    if(_sendData.length >= MAXLENGTH){
        Monitor['_monitor' + type](_sendData);
        _sendData = [];
    }
    GlobalContext.set('monitor' + type, _sendData);
}

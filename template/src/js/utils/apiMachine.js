import _pick from 'lodash/pick'
import _assign from 'lodash/assign'
import _isEmpty from 'lodash/isEmpty'
import { LOCAL_AJAX, TESTPATH } from 'Config'

/**
 * ApiMachine
 * @description 简易的api组装器，自动添加命名空间
 * @author Zero
 */

export class ApiMachine {
    constructor(apiMap = {}) {
        this._apiMap = {}
        // Object.keys(apiMap)。。。。返回以apiMap下所有key键组成的数组。
        Object.keys(apiMap).map((key) => {
            // 每个key（即）所对应的所有接口对象。
            this.makeApiMap(key, apiMap[key])
        })
    }

    makeApiMap(name = "", apis = []) {
        apis.map((api) => {
            let apiname = name + '/' + api.name,
                apiDesc = api.desc,
                apiMap = this._apiMap,
                apiParams = api.params || {},
                apiBaseURL = LOCAL_AJAX ? TESTPATH : '',
                apiMethod = api.method || 'get',
                apiUrl = LOCAL_AJAX ? api.localPath : api.path

            assert(api.name, `${apiUrl} :接口name属性不能为空`)
            assert(apiUrl.indexOf('/') === 0, `${apiUrl} :接口路径path，首字符应为/`)

            Object.defineProperty(apiMap, apiname, {
                value(params, options) {
                    let _data = _isEmpty(params) ? apiParams : _pick(_assign({}, apiParams, params), Object.keys(apiParams))
                    return GLOBAL.ajax(normoalize(_assign({
                        url: apiUrl,
                        baseURL: apiBaseURL,
                        method: apiMethod,
                        desc: apiDesc
                    }, options), _data))
                }
            })
        })
    }
}

function normoalize(options, data) {
    if(options.method === 'POST') {
        options.data = data
    }else if (options.method === 'GET') {
        options.params = data
    }
    return options
}

function assert(condition, msg) {
    if (!condition) throw new Error(`[ApiMachine] ${msg}`)
}

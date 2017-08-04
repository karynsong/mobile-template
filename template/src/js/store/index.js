import _isObject from 'lodash/isObject';
import _isFunction from 'lodash/isFunction';
import _cloneDeep from 'lodash/cloneDeep';

// Vue.use(Vuex);
import common from './common';
const store = new Vuex.Store({
    ...common,
    strict: process.env.NODE_ENV !== 'production'
})

// const _registerModule = store.registerModule;
// store.registerModule = (...opts) => {
// 	var _store = opts[1];
// 	for(let x in _store.modules){
// 		let _modules = _store.modules[x];
// 		if(_isObject(_modules['state']) && !_isFunction(_modules['state'])){
//             let _state = _modules['state'];
//             _modules['state'] = () => {
//                 return JSON.parse(JSON.stringify(_state));
//             }
//         }
// 	}
//     _registerModule.call(store, ...opts);
// }

export default store;
// AjaxPlugin
import Service from 'Service'
export default {
    install: (Vue, options) => {
        Vue.prototype.ajax = GLOBAL.ajax
        Vue.prototype.$service = Service._apiMap
    }
}
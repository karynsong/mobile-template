import { createElement } from '../utils'

import Alert from './Alert'
import AlertIOS from './AlertIOS'
import Confirm from './Confirm'
import ConfirmIOS from './ConfirmIOS'
import Popup from './Popup'

let vm

class Dialog {
    show(type, options) {
        let rnd = Math.random().toString(36).substring(3, 6)
        let marker = `von-${type}-${rnd}`
        createElement(marker)
        let selector = `[${marker}]`

        vm = new Vue(
            type == 'alert' ? (options.theme == 'ios' ? AlertIOS : Alert) : type == 'alert' ? (options.theme == 'ios' ? ConfirmIOS : Confirm) : Popup
        ).$mount(selector)

        vm.$el.setAttribute('von-dialog', '')

        return vm.show(options)
    }

    alert(options) {
        return this.show('alert', options)
    }

    confirm(options) {
        return this.show('confirm', options)
    }

    popup(options) {
        return this.show('popup', options)
    }

    hide() {
        if (vm) vm.hide()
    }
}

window.$dialog = new Dialog()

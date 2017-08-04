import Loading from './Loading'
import {createElement, timeout} from '../utils'

function VonicLoading() {
  let vm = undefined
  let type = ''

  function showToast(options, duration) {
    type = 'toast'
    if (vm && vm.getState() > 0) {
      // vm.update({
      //   tips: tips
      // })
      vm.update(options);

      setTimeout(() => {
        hide('toast')
      }, duration || 1500)
      return
    }

    createElement('von-loading')
    vm = new Vue(Loading).$mount('[von-loading]')
    // vm.show({
    //   tips: tips
    // })

    vm.show(options);

    return timeout(duration || 1500).then(() => {
      return hide('toast')
    })
  }

  function showLoading(tips) {
    type = 'loading'
    if (vm && vm.getState() > 0) {
      vm.update({
        tips: tips,
        showSpinner: true
      })
      return
    }

    createElement('von-loading')
    vm = new Vue(Loading).$mount('[von-loading]')
    vm.show({
      tips: tips,
      showSpinner: true
    })
  }

  function hide(hideType, doNow) {
    if (vm && type === hideType) {
      vm.hide(doNow)
    }
  }

  function update(options) {
    vm.update(options)
  }

  return {
    showToast,
    showLoading,
    hide,
    update
  }
}

let loading = new VonicLoading()

window.$loading = {
  show: loading.showLoading,
  hide(doNow){
    loading.hide('loading', doNow)
  }
}

window.$toast = {
  show: loading.showToast,
  hide(){
    loading.hide('toast')
  }
}

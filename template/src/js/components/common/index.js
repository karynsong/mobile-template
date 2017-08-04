/**
 * 这里注册全局组件
 * 单页面应用中 建议所有组件都挂载到全局 而不用在各处import
 */

import 'Components/vonic/services/modal';
import 'Components/vonic/services/loading';
import 'Components/vonic/services/backdrop';
import 'Components/vonic/services/popup';
import 'Components/vonic/services/popup/dialog.js'

// 自定义组件
import InputBox from 'Components/inputBox';
Vue.component('input-box', InputBox)

// 刷新组件
import Refresh from 'Components/refresh';
Vue.component('refresh', Refresh)

// pop actionSheet
import ActionSheet from 'Components/actionSheet';
Vue.component('action-sheet', ActionSheet)
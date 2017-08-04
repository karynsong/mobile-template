<template>
  <div class="popup-container" :effect="effect"
       :class="{'popup-showing active': state == 1, 'popup-showing popup-hidden': state == 2}">
    <div class="popup von-popup" :class='cssClass'>
      <div v-if="title" class="popup-head">
        <div class="popup-title" v-html="title" :class='titleClass'></div>
      </div>

      <div class="popup-body" :class="{'no-content': state == 0}">
        <p v-if="content" v-html='content' class='bm-ionic-popup' :class='contentClass'></p>
        <slot></slot>
        <button v-if="showClose == 'true'" class="button button-royal button-small button-clear button-close" @click="hide(-1)">
          <i class="ion-ios-close-empty"></i>
        </button>
      </div>

      <div v-if="buttons.length > 0" class="popup-buttons">
        <button v-for="(b, index) in buttons" class="button button-block" :class='b.class' @click="hide(index)">
        <div class="hairline-top"></div>
        <div class="hairline-left" v-if="index > 0"></div>
        <span v-text="b.text"></span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
  const popup_leave_duration = 300

  export default {
    data() {
      return {
        state: 0,         // 0: hidden, 1: showing, 2: active
        effect: 'default',
        showClose: 'false',
        cssClass: '',
        title: '',
        titleClass: '',
        content: '',
        contentClass: '',
        buttons: [{
          class: 'c-blue',
          text: '知道了'
        }]
      }
    },
    mounted() {
      if (this.cssClass)
        this.$el.querySelector('.von-popup').classList.add(this.cssClass)
    },

    methods: {
      show(options) {
        // 覆盖默认信息
        this.content = options.content
        this.contentClass = options.contentClass

        this.title = options.title
        this.titleClass = options.titleClass

        this.cssClass = options.cssClass
        this.effect = options.effect ? options.effect : 'default'
        this.showClose = options.showClose ? options.effect : 'false'

        this.setButtons(options.buttons)

        // 修改状态
        this.state = 1
        window.$backdrop.show()
        document.body.classList.add('popup-open')

        // 弹窗popup回调事件
        return new Promise((resolve, reject) => {
          this.$on('PopupButtonClickEvent', (data) => {
            // 加这个数字类型判断，是因为，当页面有弹窗显示时，此时点击back，弹窗会一直存在，
            // 解决方法是：利用 beforeRouteLeave 让弹窗hide，但会触发弹窗回调，此时 buttonIndex 为 undefined 。就会触发reject()，影响交互。
            // 所以判断 buttonIndex 是否为 number 类型，再触发回调。
            if(typeof data.buttonIndex === "number"){
              data.buttonIndex === 1 ? resolve() : reject()
            }
            // resolve(data.buttonIndex)
          })
        });
      },

      hide(buttonIndex) {
        if(this.state != 1) return
        // 修改状态
        this.state = 2
        window.$backdrop.hide()
        document.body.classList.remove('popup-open')

        setTimeout(() => {
          this.state = 0
          this.$emit('PopupButtonClickEvent', {buttonIndex: buttonIndex})
        }, popup_leave_duration)
      },

      setButtons(buttons){
        if(buttons){
          this.buttons = buttons.map(item => {
            if(!item.class){
              item.class = 'c-blue';
            }
            return item
          })
        }
      }
    }
  }
</script>

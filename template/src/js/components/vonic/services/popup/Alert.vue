<template>
  <div class="popup-container" :effect="effect"
       :class="{'popup-showing active': state == 1, 'popup-showing popup-hidden': state == 2}">
    <div class="popup">
      <div class="popup-head" v-if='title'>
        <div class="popup-title" v-html="title"></div>
      </div>

      <div class="popup-body" v-if='content' v-html="content"></div>

      <div class="popup-buttons">
        <button
          class="button button-block"
          :class="{
            'button-assertive': okTheme == 'assertive',
            'button-positive': okTheme == 'positive',
            'button-balanced': okTheme == 'balanced',
            'button-energized': okTheme == 'energized',
            'button-calm': okTheme == 'calm',
            'button-royal': okTheme == 'royal',
            'button-stable': okTheme == 'stable',
            'button-light': okTheme == 'light',
            'button-dark': okTheme == 'dark',
            'button-default': okTheme == 'default'
          }"
          @click="onOk()"
          v-text="okText"
        >
        </button>
      </div>
    </div>
  </div>
</template>
<script>
  import mixin from './mixin'

  export default {
    mixins: [mixin],

    data() {
      return {
        effect: 'default', // default, scale, slide
        title: '',
        content: '',
        okText: '确定',
        okTheme: 'wechat',
        state: 0 // 0: hidden, 1: showing, 2: active
      }
    }
  }
</script>

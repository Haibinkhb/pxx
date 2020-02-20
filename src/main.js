// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import LyTab from 'ly-tab'
import $ from 'jquery'
import store from './store/index'
import BScroll from 'better-scroll'
import VueScroller from 'vue-scroller'
import VueLazyload from 'vue-lazyload'  //引入这个懒加载插件
import "./../static/js/Symobl/Symbol.js"

// 添加VueLazyload 选项
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '../static/error.png',
  loading: '../static/loading.gif',
  attempt: 1,
  listenEvents: ['scroll']
})



Vue.use(VueScroller)

 
Vue.use(LyTab);



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  LyTab,
  store,
  $,
  BScroll,
  VueScroller,
  components: { App },
  template: '<App/>'
})

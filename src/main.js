import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.use(ElementUI);
import axios from 'axios'
// 全局注册
// import with ES6
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import vueWechatTitle from 'vue-wechat-title'
Vue.use(vueWechatTitle)
// use
Vue.use(mavonEditor)
Vue.prototype.$ajax= axios
import qs from 'qs';
Vue.use(qs)


Vue.prototype.requestURL='https://localhost:8888'
// import $ from 'jquery'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

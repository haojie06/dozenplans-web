// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import qs from 'qs'
import store from './store'

// 反向代理
let axios = require('axios')
axios.defaults.baseURL = 'http://localhost:8080/api'
// 全局注册
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.config.productionTip = false

Vue.use(ElementUI)
/* eslint-disable no-new */
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth === true) {
    if (store.state.user.username && store.state.token) {
      next()
    } else {
      next({
        path: 'login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  components: { App },
  template: '<App/>'
})

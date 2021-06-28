import Vue from 'vue'
import Router from 'vue-router'
import AppIndex from '../components/home/AppIndex'
import Register from '../components/Register'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Register
    },
    {
      path: '/',
      name: 'AppIndex',
      component: AppIndex
    }
  ]
})

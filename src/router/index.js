import Vue from 'vue'
import Router from 'vue-router'
import AppIndex from '../components/home/AppIndex'
import Register from '../components/Register'
import Login from '../components/Login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'AppIndex',
      component: AppIndex
    }
  ]
})

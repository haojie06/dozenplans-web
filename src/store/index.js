import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      // 为什么此处使用【】而不仅仅判定是否有user这个key
      username: window.localStorage.getItem('user' || '[]') == null
        ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username
    },
    token: window.localStorage.getItem('token') == null
      ? '' : window.localStorage.getItem('token'),
    showList: []
  },
  mutations: {
    login (state, user) {
      state.user = user
      window.localStorage.setItem('user', JSON.stringify(user))
    },

    setToken (state, token) {
      state.token = token
      window.localStorage.setItem('token', token)
    },
    logout (state) {
      state.user = null
      state.token = null
      window.localStorage.removeItem('user')
      window.localStorage.removeItem('token')
    },
    setShowList (state, list) {
      state.showList = list
    }
  }
  // getters: {
  //   user: function (state) {
  //     if (!state.user) {
  //     }
  //   }
  // }
})

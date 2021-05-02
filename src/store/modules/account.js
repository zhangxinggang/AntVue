import Vue from 'vue'
import { constant } from '@/config'
import { axios } from '@/services/request'
export default {
  namespaced: true,
  state: {
    user: undefined
  },
  getters: {
    user: state => {
      if (!state.user) {
        try {
          const user = Vue.ls.get('userInfo')
          state.user = JSON.parse(user)
        } catch (e) {
          console.error(e)
        }
      }
      return state.user
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      if(!token){
        Vue.ls.remove(constant.tokenName)
        return
      }
      Vue.ls.set(constant.tokenName, token, 7 * 24 * 60 * 60 * 1000)
    },
    SET_USER (state, userInfo) {
      if(!userInfo){
        Vue.ls.remove('userInfo')
        return
      }
      delete userInfo.token
      Vue.ls.set('userInfo', JSON.stringify(userInfo))
    }
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        axios({
          name: 'login',
          data: userInfo
        })
          .then((response) => {
            const {data} = response
            commit('SET_TOKEN', data.token)
            commit('SET_USER', data)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    Logout({commit}){
      commit('SET_TOKEN', null)
      commit('SET_USER', null)
    }
  }
}
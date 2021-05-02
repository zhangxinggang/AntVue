import Vue from 'vue'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { constant } from '@/config'
import Http from '@g/http'
import apiList from './api'

let baseURL = 'http://127.0.0.1:8089'
const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(constant.tokenName)
    if (error.response.status === 403) {
      notification.error({
        message: '被禁用的',
        description: data.message,
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLoginRequest)) {
      notification.error({
        message: '非法访问',
        description: '授权验证失败',
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}
let http = new Http({
  baseURL,
  apiList,
  beforeRequest(config) {
    const token = Vue.ls.get(constant.tokenName)
    if (token) {
      config.headers['Access-Token'] = token
    }
    return config
  },
  requestErrorHandler: err,
  responseErrorHandler: err
})
let axios = http.request
export { axios }

import { axios } from '@/services/request'
export default {
  namespaced: true,
  state: {
    
  },
  getters: {
    
  },
  mutations: {},
  actions: {
    tableList({ commit }, params) {
      return new Promise((resolve, reject) => {
        axios({
          name: 'tableList',
          data: params
        })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
      })
    }
  }
}
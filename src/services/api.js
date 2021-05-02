const api = {
  login: { method: 'post', url: '/auth/login' },
  loginOut: { method: 'post', url: '/auth/logout' },
  userInfo: { method: 'post', url: '/user/info' },
  tableList: { method: 'get', url: '/example/tableList'}
}
export default api
// 自定义配置，参考 ./default/setting.config.js，需要自定义的属性在这里配置即可
module.exports = {
  theme: {
    color: '#13c2c2',
    mode: 'dark',
  },
  multiPage: true,
  animate: {
    name: 'lightSpeed',
    direction: 'left'
  },
  constant:{
    tokenName:'token',
    sysSettingName:'sysSetting'
  },
  // vue-ls options Vue-ls 插件配置项 (localStorage/sessionStorage)
  storageOptions: {
    namespace: 'MU_',
    name: 'ls', // 用 Vue.name.xx(get/set/remove/clear)
    storage: 'local', // session, local, memory
  }
}

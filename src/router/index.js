import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 不需要登录拦截的路由配置
const loginIgnore = {
  names: ['404', '403'],      //根据路由名称匹配
  paths: ['/login'],   //根据路由fullPath匹配
  includes(route) {
    return this.names.includes(route.name) || this.paths.includes(route.path)
  }
}

function initRouter(i18n) {
  const options = require('./config').default
  let translateRoutesKey=(route,isRoot)=>{
    route.forEach(item=>{
      if(isRoot){
        const { path } = item
        if (!path.startsWith('/') && path !== '*') {
          item.path = '/' + path
        }
      }
      !item.meta && (item.meta = {})
      item.meta.title=item.meta.title ? i18n.t(item.meta.title) : item.name
      if(item.children){
        translateRoutesKey(item.children,false)
      }
    })
  }
  translateRoutesKey(options.routes,true)
  return new Router(options)
}
export {loginIgnore, initRouter}

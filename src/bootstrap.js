import {loadRoutes, loadGuards, setAppOptions} from '@/router/load'

function bootstrap({router, store, i18n, message}) {
  // 设置应用配置
  setAppOptions({router, store, i18n})
  // 加载路由
  loadRoutes()
  // 加载路由守卫
  loadGuards({router, store, i18n, message})
}

export default bootstrap

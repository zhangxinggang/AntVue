import Vue from 'vue'
import App from './App.vue'
// import 'ant-design-vue/dist/antd.less'
// import Antd from 'ant-design-vue'
// Vue.use(Antd)
import {initRouter} from './router'
// import './theme/index.less'
import store from './store'
import './mock/load'
import i18n from './language/i18n'
import 'animate.css/source/animate.css'
import bootstrap from '@/bootstrap'
import plugins from './plugins'
Vue.use(plugins)

const router = initRouter(i18n)

Vue.config.productionTip = false
import { message } from 'ant-design-vue'
Vue.prototype.$message = message;
bootstrap({router, store, i18n, message: Vue.prototype.$message})
new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')



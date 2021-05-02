import VueStorage from 'vue-ls'
import { storageOptions } from '@/config'
let install = function(Vue){
    return Vue.use(VueStorage,storageOptions)
}
export {
    install
}
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function loadModules(){
    const files = require.context('./modules',true,/\.js$/i)
    const modules = {}
    files.keys().forEach(key=>{
        let value = key.replace(/\\/g,'/')
        let matched = value.match(/\/(\S*)\.js$/i)
        if(matched && matched.length > 1){
            let target = matched[1].split('/')
            if(target.length < 3){
                let content = files(key)
                modules[target[0]] = content.default || content
            }
        }
    })
    return modules
}

const store = new Vuex.Store({modules:loadModules()})

export default store
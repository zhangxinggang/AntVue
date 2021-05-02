const pluginFile = require.context('./', true, /js$/i)
const plugins = {}
pluginFile.keys().forEach(component => {
    let fileName = component.replace(/\\/g,'/')
    if(fileName !='./index.js'){
        const content = pluginFile(fileName).default || pluginFile(fileName)
        plugins[fileName] = content
    }
})
const installObj = {
    install:function(Vue){
        for(let key in plugins){
            Object.keys(plugins[key]).forEach(name=>{
                Vue.use(plugins[key][name])
            })
        }
    }
}
export default installObj
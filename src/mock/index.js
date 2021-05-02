import Mock from 'mockjs'
import api from '@/services/api'

Mock.setup({
  timeout: 800
})

function setResponse(data){
  return {
    code: 10000,
    message: '',
    data:data
  }
}

function mock(obj){
  //obj.name必须存在
  let apiObj = api[obj.name]
  Mock.mock(new RegExp(obj.url || apiObj.url), apiObj.method, (params)=>{
    return setResponse(obj.request(params))
  })
}

export default mock
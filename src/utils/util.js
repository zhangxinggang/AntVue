import enquireJs from 'enquire.js'
const _toString = Object.prototype.toString

export function isDef (v){
  return v !== undefined && v !== null
}

export function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

export function enquireScreen(call) {
  const handler = {
    match: function () {
      call && call(true)
    },
    unmatch: function () {
      call && call(false)
    }
  }
  enquireJs.register('only screen and (max-width: 767.99px)', handler)
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 返回的树数组
 * @param pid 父ID
 * @example 
 * list:[{id:1,pid:-1,text:1},{id:2,pid:1,text:2}]
 * var finalRes = []
 * listToTree(list,finalRes,-1)
 * @returns
 * finalRes = [{id:1,pid:-1,text:1,children:[{id:2,pid:1,text:2}]}]
*/
export function listToTree(list, tree, pid) {
  list.forEach((item) => {
    if (item.pid === pid) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      listToTree(list, child.children, item.id)
      tree.push(child)
    }
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @example 
 * list:[{id:1,pid:-1,text:1},{id:2,pid:1,text:2}]
 * formatterTree(list)
 * @returns
 * [{id:1,pid:-1,text:1,children:[{id:2,pid:1,text:2}]}]
*/
export function formatterTree(list) {
  let hash = {}
  for (let i = 0; i < list.length; i++) {
    let id = list[i]['id']
    hash[id] = list[i]
  }
  let dealData = []
  for (let i = 0; i < list.length; i++) {
    if (!hash[list[i]['pid']]) {
      dealData.push(list[i])
    } else {
      !hash[list[i]['pid']]['children'] && (hash[list[i]['pid']]['children'] = [])
      hash[list[i]['pid']]['children'].push(list[i])
    }
  }
  return dealData
}
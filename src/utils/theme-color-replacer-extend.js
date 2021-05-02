/**
 * webpack-theme-color-replacer 插件的 resolve 配置
 * 为特定的 css 选择器（selector）配置 resolve 规则。
 *
 * key 为 css selector 值或合法的正则表达式字符串
 * 当 key 设置 css selector 值时，会匹配对应的 css
 * 当 key 设置为正则表达式时，会匹配所有满足此正则表达式的的 css
 *
 * value 可以设置为 boolean 值 false 或 一个对象
 * 当 value 为 false 时，则会忽略此 css，即此 css 不纳入 webpack-theme-color-replacer 管理
 * 当 value 为 对象时，会调用该对象的 resolve 函数，并传入 cssText（原始的 css文本） 和 cssObj（css对象）参数; resolve函数应该返
 * 回一个处理后的、合法的 css字符串（包含 selector）
 * 注意: value 不能设置为 true
 */
 const cssResolve = {
  '.ant-checkbox-checked .ant-checkbox-inner::after': {
    resolve(cssText, cssObj) {
      cssObj.rules.push('border-top:0', 'border-left:0')
      return cssObj.toText()
    }
  },
  '.ant-tree-checkbox-checked .ant-tree-checkbox-inner::after': {
    resolve(cssText, cssObj) {
      cssObj.rules.push('border-top:0', 'border-left:0')
      return cssObj.toText()
    }
  },
  '.ant-checkbox-checked .ant-checkbox-inner:after': {
    resolve(cssText, cssObj) {
      cssObj.rules.push('border-top:0', 'border-left:0')
      return cssObj.toText()
    }
  },
  '.ant-tree-checkbox-checked .ant-tree-checkbox-inner:after': {
    resolve(cssText, cssObj) {
      cssObj.rules.push('border-top:0', 'border-left:0')
      return cssObj.toText()
    }
  },
  '.ant-menu-dark .ant-menu-inline.ant-menu-sub': {
    resolve(cssText, cssObj) {
      cssObj.rules = cssObj.rules.filter(rule => rule.indexOf('box-shadow') == -1)
      return cssObj.toText()
    }
  },
  '.ant-menu-horizontal>.ant-menu-item:hover,.ant-menu-horizontal>.ant-menu-submenu:hover,.ant-menu-horizontal>.ant-menu-item-active,.ant-menu-horizontal>.ant-menu-submenu-active,.ant-menu-horizontal>.ant-menu-item-open,.ant-menu-horizontal>.ant-menu-submenu-open,.ant-menu-horizontal>.ant-menu-item-selected,.ant-menu-horizontal>.ant-menu-submenu-selected': {
    resolve(cssText, cssObj) {
      cssObj.selector = cssObj.selector.replace(/.ant-menu-horizontal/g, '.ant-menu-horizontal:not(.ant-menu-dark)')
      return cssObj.toText()
    }
  },
  '.ant-menu-horizontal>.ant-menu-item-active,.ant-menu-horizontal>.ant-menu-item-open,.ant-menu-horizontal>.ant-menu-item-selected,.ant-menu-horizontal>.ant-menu-item:hover,.ant-menu-horizontal>.ant-menu-submenu-active,.ant-menu-horizontal>.ant-menu-submenu-open,.ant-menu-horizontal>.ant-menu-submenu-selected,.ant-menu-horizontal>.ant-menu-submenu:hover': {
    resolve(cssText, cssObj) {
      cssObj.selector = cssObj.selector.replace(/.ant-menu-horizontal/g, '.ant-menu-horizontal:not(.ant-menu-dark)')
      return cssObj.toText()
    }
  },
  '.ant-layout-sider': {
    resolve(cssText, cssObj) {
      cssObj.selector = '.ant-layout-sider-dark'
      return cssObj.toText()
    }
  },
  '/keyframes/': false
}

// 修正 webpack-theme-color-replacer 插件提取的 css 结果
function resolveCss(output, srcArr) {
  let regExps = []
  // 提取 resolve 配置中所有的正则配置
  Object.keys(cssResolve).forEach(key => {
    let isRegExp = false
    let reg = {}
    try {
      reg = eval(key)
      isRegExp = reg instanceof RegExp
    } catch (e) {
      isRegExp = false
    }
    if (isRegExp) {
      regExps.push([reg, cssResolve[key]])
    }
  })

  // 去重
  srcArr = dropDuplicate(srcArr)

  // 处理 css
  let outArr = []
  srcArr.forEach(text => {
    // 转换为 css 对象
    let cssObj = parseCssObj(text)
    // 根据selector匹配配置，匹配成功，则按配置处理 css
    if (cssResolve[cssObj.selector] != undefined) {
      let cfg = cssResolve[cssObj.selector]
      if (cfg) {
        outArr.push(cfg.resolve(text, cssObj))
      }
    } else {
      let cssText = ''
      // 匹配不成功，则测试是否有匹配的正则配置，有则按正则对应的配置处理
      for (let regExp of regExps) {
        if (regExp[0].test(cssObj.selector)) {
          let cssCfg = regExp[1]
          cssText = cssCfg ? cssCfg.resolve(text, cssObj) : ''
          break
        }
        // 未匹配到正则，则设置 cssText 为默认的 css（即不处理）
        cssText = text
      }
      if (cssText != '') {
        outArr.push(cssText)
      }
    }
  })
  output = outArr.join('\n')
  return output
}

// 数组去重
function dropDuplicate(arr) {
  let map = {}
  let r = []
  for (let s of arr) {
    if (!map[s]) {
      r.push(s)
      map[s] = 1
    }
  }
  return r
}

/**
 * 从字符串解析 css 对象
 * @param cssText
 * @returns {{
 *   name: String,
 *   rules: Array[String],
 *   toText: function
 * }}
 */
function parseCssObj(cssText) {
  let css = {}
  const ruleIndex = cssText.indexOf('{')
  css.selector = cssText.substring(0, ruleIndex)
  const ruleBody = cssText.substring(ruleIndex + 1, cssText.length - 1)
  const rules = ruleBody.split(';')
  css.rules = rules
  css.toText = function () {
    let body = ''
    this.rules.forEach(item => {body += item + ';'})
    return `${this.selector}{${body}}`
  }
  return css
}

module.exports = {resolveCss}

import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

function loadLocaleMessages () {
    const locales = require.context('./', true, /[A-Za-z0-9-_,\s]+\.json$/i)
    const messages = {}
    locales.keys().forEach(key => {
      const matched = key.match(/([A-Za-z0-9-_]+)\./i)
      if (matched && matched.length > 1) {
        const locale = matched[1]
        messages[locale] = locales(key)
      }
    })
    return messages
}
// 获取当前浏览器语言
const lang = navigator.language || navigator.userLanguage
export default new VueI18n({
    locale: lang,
    fallbackLocale:'zh-CN',
    messages: loadLocaleMessages()
})
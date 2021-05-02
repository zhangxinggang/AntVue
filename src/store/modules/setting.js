import Vue from 'vue'
import config from '@/config'
import {ADMIN} from '@/config/default'
import {getLocalSetting} from '@/utils/themeUtil'
import {extractConfig} from '@/utils/extractConfig'

const localSetting = getLocalSetting(true)

export default {
  namespaced: true,
  state: {
    isMobile: false,
    animates: ADMIN.animates,
    palettes: ADMIN.palettes,
    pageMinHeight: 0,
    menuData: [],
    activatedFirst: undefined,
    ...config,
    ...localSetting
  },
  getters: {
    menuData(state, getters, rootState) {
      return state.menuData
    },
    firstMenu(state) {
      const {menuData} = state
      return menuData.map(item => {
        const menuItem = {...item}
        delete menuItem.children
        return menuItem
      })
    },
    subMenu(state) {
      const {menuData, activatedFirst} = state
      const current = menuData.find(menu => menu.fullPath === activatedFirst)
      return current && current.children || []
    }
  },
  mutations: {
    setMenuCollapsed (state, menuCollapsed){
      if(typeof(menuCollapsed) == 'undefined'){
        state.menuCollapsed = !state.menuCollapsed
      }else{
        state.menuCollapsed = menuCollapsed
      }
      let setting = extractConfig(true)
      Vue.ls.set(config.constant.sysSettingName,setting)
    },
    setDevice (state, isMobile) {
      state.isMobile = isMobile
    },
    setTheme (state, theme) {
      state.theme = theme
    },
    setLayout (state, layout) {
      state.layout = layout
    },
    setMultiPage (state, multiPage) {
      state.multiPage = multiPage
    },
    setAnimate (state, animate) {
      state.animate = animate
    },
    setWeekMode(state, weekMode) {
      state.weekMode = weekMode
    },
    setFixedHeader(state, fixedHeader) {
      state.fixedHeader = fixedHeader
    },
    setFixedSideBar(state, fixedSideBar) {
      state.fixedSideBar = fixedSideBar
    },
    setLang(state, lang) {
      state.lang = lang
    },
    setHideSetting(state, hideSetting) {
      state.hideSetting = hideSetting
    },
    correctPageMinHeight(state, minHeight) {
      state.pageMinHeight += minHeight
    },
    setMenuData(state, menuData) {
      state.menuData = menuData
    },
    setPageWidth(state, pageWidth) {
      state.pageWidth = pageWidth
    },
    setActivatedFirst(state, activatedFirst) {
      state.activatedFirst = activatedFirst
    },
    setFixedTabs(state, fixedTabs) {
      state.fixedTabs = fixedTabs
    }
  }
}

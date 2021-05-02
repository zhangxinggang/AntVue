<template>
  <a-layout-sider :theme="sideTheme" :class="['side-menu', 'beauty-scroll', isMobile ? null : 'shadow']" width="256px" :collapsible="collapsible" v-model="menuCollapsed" :trigger="null">
    <div class="side-menu-box">
      <div :class="['logo', theme]">
        <img src="@/assets/img/logo.png">
        <h1>{{systemName}}</h1>
      </div>
      <div class="side-menu-box-main beauty-scroll">
        <i-menu :theme="theme" :collapsed="menuCollapsed" :options="menuData" @select="onSelect" class="menu"/>
      </div>
      <div v-if="collapsedPosition == 'bottom' " :class="['side-menu-box-bottom',menuCollapsed?'side-menu-box-bottom_coll':'side-menu-box-bottom_uncoll', theme]">
        <div :class="['side-menu-box-bottom-sbtn']"  @click="toggleCollapse">
          <a-icon class="trigger" :type="menuCollapsed ? 'menu-unfold' : 'menu-fold'"/>
        </div>
      </div>
    </div>
  </a-layout-sider>
</template>

<script>
import IMenu from './menu'
import {mapState,mapMutations} from 'vuex'
export default {
  name: 'SideMenu',
  components: {IMenu},
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    menuData: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },
  computed: {
    sideTheme() {
      return this.theme == 'light' ? this.theme : 'dark'
    },
    ...mapState('setting', ['isMobile', 'systemName', 'menuCollapsed', 'collapsedPosition'])
  },
  methods: {
    ...mapMutations('setting',['setMenuCollapsed']),
    toggleCollapse(){
      this.setMenuCollapsed()
    },
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>

<style lang="less" scoped>
  .shadow{
    box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
  }
  .side-menu{
    min-height: 100vh;
    overflow-y: auto;
    z-index: 10;
    &-box{
      display:flex;
      flex-direction: column;
      height: 100vh;
      &-main{
        height:calc(100% - 104px);
        overflow:overlay
      }
      &-bottom{
        display: flex;
        height: 40px;
        background-color: @layout-trigger-background;
        color: @menu-dark-highlight-color;
        &.light{
          background-color: #fff;
          color: @primary-color;
        }
        &-sbtn{
          height: 100%;
          width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor:pointer;
          &:hover{
            color: @primary-color;
          }
        }
        &_coll{
          justify-content: center;
        }
        &_uncoll{
          justify-content: flex-end;
        }
      }
    }
    .logo{
      height: 64px;
      position: relative;
      line-height: 64px;
      padding-left: 24px;
      -webkit-transition: all .3s;
      transition: all .3s;
      overflow: hidden;
      background-color: @layout-trigger-background;
      &.light{
        background-color: #fff;
        h1{
          color: @primary-color;
        }
      }
      h1{
        color: @menu-dark-highlight-color;
        font-size: 20px;
        margin: 0 0 0 12px;
        display: inline-block;
        vertical-align: middle;
      }
      img{
        width: 32px;
        vertical-align: middle;
      }
    }
  }
  .menu{
    padding: 16px 0;
    width: 100%
  }
</style>

<template>
  <div class="page-layout">
    <page-header ref="pageHeader" :breadcrumb="breadcrumb" :title="pageTitle" :logo="logo" :avatar="avatar">
      <slot name="action"  slot="action"></slot>
      <slot slot="content" name="headerContent"></slot>
      <div slot="content" v-if="!this.$slots.headerContent && desc">
        <p>{{desc}}</p>
        <div v-if="this.linkList" class="link">
          <template  v-for="(link, index) in linkList">
            <a :key="index" :href="link.href"><a-icon :type="link.icon" />{{link.title}}</a>
          </template>
        </div>
      </div>
      <slot v-if="this.$slots.extra" slot="extra" name="extra"></slot>
    </page-header>
    <div ref="page" :class="['page-content', layout, pageWidth]" >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/page/header/PageHeader'
import {mapState, mapMutations} from 'vuex'

export default {
  name: 'PageLayout',
  components: {PageHeader},
  props: ['desc', 'logo', 'title', 'avatar', 'linkList', 'extraImage'],
  data () {
    return {
      page: {},
      pageHeaderHeight: 0,
    }
  },
  watch: {
    $route() {
      this.page = this.$route.meta.page
    }
  },
  updated() {
    if (!this._inactive) {
      this.updatePageHeight()
    }
  },
  activated() {
    this.updatePageHeight()
  },
  deactivated() {
    this.updatePageHeight(0)
  },
  mounted() {
    this.updatePageHeight()
  },
  created() {
    this.page = this.$route.meta.page
  },
  beforeDestroy() {
    this.updatePageHeight(0)
  },
  computed: {
    ...mapState('setting', ['layout', 'multiPage', 'pageMinHeight', 'pageWidth']),
    pageTitle() {
      return this.$route.meta.title || this.title
    },
    breadcrumb() {
      let routes = this.$route.matched
      let breadcrumb = []
      routes.forEach(route => {
        !route.meta.hideTitle && route.meta.title && breadcrumb.push(route.meta.title)
      })
      return breadcrumb
    },
    marginCorrect() {
      return this.multiPage ? 24 : 0
    }
  },
  methods: {
    ...mapMutations('setting', ['correctPageMinHeight']),
    /**
     * 用于计算页面内容最小高度
     * @param newHeight
     */
    updatePageHeight(newHeight = this.$refs.pageHeader.$el.offsetHeight + this.marginCorrect) {
      this.correctPageMinHeight(this.pageHeaderHeight - newHeight)
      this.pageHeaderHeight = newHeight
    }
  }
}
</script>

<style lang="less">
	.page-layout{
		display: flex;
		flex-direction: column;
		height: 100%;
		.page-content{
		  position: relative;
			flex: 1;
		  &.side{
		  }
		}
	}
  .link{
    /*margin-top: 16px;*/
    line-height: 24px;
    a{
      font-size: 14px;
      margin-right: 32px;
      i{
        font-size: 22px;
        margin-right: 8px;
      }
    }
  }
</style>

<template>
  <page-layout>
    <div slot="headerContent">
      头部信息
    </div>
    <template slot="extra">
      其他信息
    </template>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'

export default {
  name: 'WorkPlace',
  components: {PageLayout},
  data () {
    return {
    }
  },
  created() {
    
  }
}
</script>
<template>
	<div>
		<a-button type="primary" @click="changeMap">切换地图（当前地图：{{isOverseas?'BingMap':'BaiduMap'}}）</a-button>
		<div style="width:100vw;height:280px">
			<map-marker :isOverseas="isOverseas"/>
		</div>
	</div>
</template>

<script>
import mapMarker from '@/components/map/marker.vue'
export default {
  name: 'example-map-marker',
  components:{
		mapMarker
	},
  data() {
		return {
			isOverseas:false
		}
  },
  created() {
	      
  },
  mounted () {
		
  },
  methods:{
		changeMap(){
			this.isOverseas=!this.isOverseas
		}
  }
}
</script>
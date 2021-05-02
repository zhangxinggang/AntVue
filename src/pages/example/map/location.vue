<template>
	<div>
		<a-button type="primary" @click="openMap">打开地图</a-button>
		<a-button type="primary" @click="changeMap">切换地图（当前地图：{{isOverseas?'BingMap':'BaiduMap'}}）</a-button>
		<map-location
			ref="mapLocation"
			:initPositionInfo="initPositionInfo"
			:isOverseas="isOverseas"
			@ok="updatePosition"
		/>
	</div>
</template>

<script>
import mapLocation from '@/components/map/location.vue'
export default {
  name: 'example-map-location',
  components:{
		mapLocation
	},
  data() {
		return {
			isOverseas:false,
			initPositionInfo:{
				lat:'36.06888256017011',
				lng:'103.84205432837643',
				addressName:'甘肃省兰州市城关区G109(南滨河东路)'
			}
		}
  },
  created() {
	      
  },
  mounted () {
		
  },
  methods:{
		openMap(){
			this.$refs.mapLocation.changeModal()
		},
		changeMap(){
			this.isOverseas=!this.isOverseas
		},
		updatePosition(positionInfo,cb){
			console.log(positionInfo,2342)
			this.initPositionInfo = positionInfo
			cb()
		}
  }
}
</script>
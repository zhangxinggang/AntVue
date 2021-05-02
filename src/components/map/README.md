## 地图选点组件

### props

| 属性名              | required | type          | default        								| 说明                                                              							  |
| -------------------| -------- | ------------- | ------------------------------|----------------------------------------------------------------------------------------------|
| initPositionInfo	 | false		| Object        | {}														| 显示地图时标点信息|
| isOverseas				 | false		| Boolean			  | false          	  						| false：百度地图 true：bing地图 																	   |
| title							 | false		| String        | choose address           			| 弹出框的标题 													|
| tip								 | false		| String        | after edit not effect address | 提示信息，固定值，输入框编辑不影响选点地址| 
| emptyTip					 | false		| String        | not null             				  | 输入框为空提示 |

### methods
| 方法名              | 参数          | 说明                                                              |
| -------------------| -------------|------------------------------------------------------------------ |
| changeModal        | 无        		| 弹出框显隐                        																  |


### 事件
| 名称					| 说明 														 | 回调参数						 |
| ------------| ---------------------------------| ---------------------------------------------|
| ok					| 点击确定按钮事件		 							 | function(positionInfo,cb){} positionInfo: lat,lng,addressName cb(error) error为空则关闭弹出框			|


### 例子
```
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
  name: 'example-location',
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
```
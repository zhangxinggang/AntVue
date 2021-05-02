<template>
	<div class="map-dashbord">
		<div v-if="isOverseas" id="map-dashbord-bing" class="map-dashbord-main" style="flex:1"></div>
		<div v-else id="map-dashbord-baidu" class="map-dashbord-main" style="flex:1"></div>
	</div>
</template>
<script>
import baiduPromise from '@/components/map/baidu'
import bingPromise from '@/components/map/bing'
import baiduMapStyle from '@/components/map/baiduMapStyle'
import bingMapStyle from '@/components/map/bingMapStyle'
export default {
  name: 'map-marker',
  data() {
		let icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPVSURBVHgB7ZpNTxNBGMf/s1vKS6IpCgHFhIoe8GBEiAcPQr31iMbojZcYY+LBwCewH8GrB0Px5kmPvYlgosZA0EjSmBjqrYRim5Jgu3W7zpRuXQpl2+3sztL2l0x3O/tk+jz/2Znp7jwEFRi9FZwhBAswJ7a6HLloZjQ2HtykB7+ZnaZhdm0lEj7OhqdvUsUrxNzZInztqvldjr5VFkBDDFWgga9dVb/L2bdaoG0iBD6Eiu3xwpJvUi3Gd+/dLxQe8GyrnvY87GMkEPBB7ZiUTMbWucHL2PmdnBgdD4ZQJ95TZyfOnukGj7YYNflGh5A+0ZKRQNAv5/EO1U9mjUJMVXBbkjU8Q/MFz/DLbViQ6MI7iWaFkBE6BxCfsW7qwR00Mq9evzF803yecoObN66jkTkoQI3LYCPiQYOh0YcJveTz+cJRrz+KhhBAD1hV1dJ5tZxoAfRe1gO3wokUgEfgOqYC9PX1oaurC/XCnI3H41AUBfXA2uERuI6pAAMDA5BlGTzY29tDIpGAFfQxzgpPTAXY2NiA1+tFvTDHmQBWYMHncjluvW7EVIBsNlsoorAzeIapAD6fr+Y5gI3zZDJZ9+1qd/AMUwGGhoYszQEseCaCVZwInmEqQDQaRWdnJ2qBBZ9KpWAVp4JnmArAJi6rk5dVeC5zZrjuYciOpe44XCWAvtY7iasEcPLW13GNACJ6n+EaAUQEz3CNAOzpTgSuEEDE2NdxhQCiep/hCgFE9T5DuADGF5ciEC6AyOAZrrgDRNL0GyOtIQDBiBbg0PuAHz834STZTAZO4fEcfv1BxsaDYrtAMBI0LKFZobFLkirN25FP53boFmpKzWGWsC/7iVLaHDRyDQ6gEfhJWV4Sc4hoZB22Q1Ig+V+qQp6vf4rEiJ4iBxuIRY+Op7unf7qtzRsw1uVyylIyEV88yt4/PAL+UCHkP0seKd8xR0ghU4w7qe14LfWBYjmEfAU2QO85tXPek5cQllUMwh5mwAMNYdhAPqe9JbARurVeWmJ7entZKjx2Etul6+cHLmB3N43ddPrYuq2tLdv8tDVBYnh4uHQ+9fAx2tvbsfjyBZTiZuujJ08L56yO4aXXp6mdsY5BBYBdOJYhsvblcyFAxbDT/PHD8gEbdm2V2ikO7kbbKgAhZJ7+1y8srd+//V8R4vH4zP4xcsC+v78/zIQqa+Mr7PQRYqj099txf1qJkhDA6e7emMfr9Rvr/ipKLJ3chtMIEeDS1bH3UnmKPn0wWV2JwGlar8TQ5LQEQJPTEgBNjpBlUJMyc22ZjpCxLtORsZ5X16KFZf4BGJnoADib7fUAAAAASUVORK5CYII='
    return {
      mapInstance:null,
      labels:[{
				zIndex:1,
				longitude:116.404,
				latitude:39.925,
				name:'北京2',
				address:'北京天安门2',
				icon:icon
			},{
				zIndex:1,
				longitude:116.404,
				latitude:39.915,
				name:'北京3',
				address:'北京天安门3',
				icon:icon
			},{
				zIndex:1,
				longitude:116.395,
				latitude:39.935,
				name:'北京4',
				address:'北京天安门4',
				icon:icon
			},{
				zIndex:1,
				longitude:116.415,
				latitude:39.931,
				name:'北京5',
				address:'北京天安门5',
				icon:icon
			}]
    }
  },
	props:{
		isOverseas:{
			type: Boolean,
			default(){
				return false
			}
		}
	},
  watch: {
		isOverseas(){
			this.clearMap()
			setTimeout(()=>{
				this.loadMap()
			},0)
		},
    mapInstance(){
      this.loadMapScenario()
    }
  },
  created() {
    this.loadMap()
  },
  mounted () {
    
  },
  beforeDestroy(){
    this.clearMap()
  },
  methods:{
    loadMapScenario() {
      if(!this.mapInstance){
        return
      }
      let self = this
      let map = this.mapInstance.map
      this.mapInstance.hideInfoWin()
      this.mapInstance.clearOverlays()
      let markers = this.labels.map(item=>{
        let options = {}
        if(this.isOverseas){
          options = {
            left:0,
            top:0
          }
        }else{
          options = {
            anchor: new window.BMapGL.Size(20, 40)
          }
        }
        return {
          zIndex:item['zIndex'],
          lng:item['longitude'],
          lat:item['latitude'],
          icon:{
            src:item.icon,
            width:40,
            height:40,
            options:options
          }
        }
      })
      this.mapInstance.setMarkers(markers).then(()=>{
        this.mapInstance.allMarkers.forEach((marker,i)=>{
          let one = this.labels[i]
          let html = `
            <div style="position:relative;width:300px;height:158px">
              <div style="width:100%; height: 100%; font-size: 14px; padding: 16px 13px 21px 18px;">
                  <div style="line-height: 24px; max-width: 100%; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">名称：${one['name']}</div>
                  <div style="line-height: 24px; margin-top: 6px; max-width: 100%; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">地址：${one['address']}</div>
              </div>
              <div class="map-marker-close-btn" style="position: absolute;top: 2px;right: 10px;cursor: pointer;">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAALCAYAAABGbhwYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACKSURBVHgBjZBBDsQgCEVFz2Y8kHFduzZeSDfTi+nwJ0NjLIv+hETgqR+o1noYVozxNIqkb8cYNOfMUtgh9MC43vvHe09czyEE01q7VojjTCllktullExEB0dGvkLIaf1K4D94Qz+PK2itndoZcrtxvMTptXt2mnFtQNohzTMGlD0+IAg19MCYt/oCpjiAhqcrL+IAAAAASUVORK5CYII=" />
              </div>
            </div>
          `
          let closeMarker = ()=>{
            let mapMarkerCloseBtn = document.getElementsByClassName('map-marker-close-btn')
            for(let i=0;i<mapMarkerCloseBtn.length;i++){
              let handler = function(){
                self.mapInstance.hideInfoWin()
              }
              mapMarkerCloseBtn[i].removeEventListener('click',handler,false)
              mapMarkerCloseBtn[i].addEventListener('click',handler,false)
            }
          }
          if(this.isOverseas){
            window.Microsoft.Maps.Events.addHandler(marker, 'click', function (args) {
              self.mapInstance.infoWin.setOptions({
                location: args.target.getLocation(),
                visible: true,
                htmlContent: html
              })
              closeMarker()
            })
          }else{
            marker.addEventListener('click',(e)=>{
              this.mapInstance.infoWin.setContent(html)
              map.openInfoWindow(this.mapInstance.infoWin,marker.getPosition())
              closeMarker()
            })
          }
        })
      })
    },
    loadMap() {
      if(this.isOverseas){
        bingPromise().then((BingMap)=>{
          this.mapInstance = BingMap.getInstance(this,{
            domId:'#map-dashbord-bing',
            showInfoWin:true,
            chooseSpots:false,
            customMapStyle:bingMapStyle
          })
        })
      }else{
        baiduPromise().then((BaiduMap)=>{
          this.mapInstance = BaiduMap.getInstance(this,{
            domId:'map-dashbord-baidu',
            customMapStyle:baiduMapStyle,
            showInfoWin:true,
            chooseSpots:false
          })
        })
      }
    },
    clearMap(){
      if(this.mapInstance) {
        this.mapInstance.destroy()
				this.mapInstance.clearOverlays()
				document.getElementsByClassName('BMap_mask')[0] && (document.getElementsByClassName('BMap_mask')[0].style.display='none')
				this.mapInstance=null
      }
    }
  }
}
</script>
<style lang="less">
	.map-dashbord{
    display: flex;
    width: 100%;
    height: 100%;
    background:#ccd6d7;
    .shadow{
      display: none !important;
    }
    .BMap_bubble_top{
      display: none !important;
    }
    .BMap_bubble_pop{
      padding: 0 !important;
      border: none !important;
      border-radius: unset !important;
      max-width: unset !important;
      max-height: unset !important;
      padding-bottom: 0 !important;
      transform: translate(-24px, 24px);
      &>img{
        display: none !important;
      }
      .BMap_bubble_content{
        width: 100% !important;
        height: 100% !important;
      }
    }
    .MicrosoftMap{
			.Infobox{
				border: none;
				background-color: unset;
			}
			.InfoboxCustom{
				width: 300px !important;
				height: 158px !important;
				max-width: unset !important;
				max-height: unset !important;
				padding-bottom: 0 !important;
				transform: translate(-50%,-12px);
				background:#fff;
			}
      .infobox-stalk{
        display: none;
      }
		}
	}
</style>
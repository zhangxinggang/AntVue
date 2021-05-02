<template>
	<div>
		<a-modal
			v-model="showModal"
			centered
			:title="title"
			:maskClosable="false"
			:bodyStyle="{padding:0}"
			@cancel="changeModal"
			:wrapClassName="'map-modal antd-theme'"
			:dialogClass="'map-modal-panel'"
      :destroyOnClose="true"
		>
			<template slot="footer">
				<a-button @click="changeModal">{{$t("global.cancel")}}</a-button>
				<a-button type="primary" @click="submit" :loading="isSaving">{{$t("global.ok")}}</a-button>
			</template>
			<div class="map-modal-body">
				<div id="map-modal-body-main" style="flex:1"></div>
				<div class="map-modal-body-act">
					<div class="map-modal-body-act-search">
						<a-input
							v-model="positionInfo.addressName"
							autocomplete="off"
							:maxLength="255"
							id="map-modal-body-act-input"
							class="map-modal-body-act-input"
							ref="mapSearchInput"
							@input="onSearchInput"
							@blur="onSearchInputBlur"
						/>
					  <div class="map-modal-body-act-search-res" v-show="showAutoAddress">
					    <ul>
					      <li v-for="(item,index) in searchAddresses" :key="index" @click="setPositionInfo({lat:item.latitude, lng: item.longitude, addressName: item.name})">{{item.name}}</li>
					    </ul>
					  </div>
					</div>
					<div v-if="errorInfo" class="map-modal-body-act-error">{{errorInfo}}</div>
					<div v-else class="map-modal-body-act-tip">{{tip}}</div>
				</div>
			</div>
		</a-modal>
	</div>
</template>

<script>
import bingPromise from '@/components/map/bing'
import baiduPromise from '@/components/map/baidu'
export default {
  name: 'map-location',
  props: {
    initPositionInfo:{
      type: Object,
      default(){
        return {}
      }
    },
    isOverseas:{
      type: Boolean,
      default(){
        return false
      }
    },
    title:{
      type: String,
      default(){
        return 'choose address'
      }
    },
    tip:{
      type: String,
      default(){
        return 'after edit not effect address'
      }
    },
    emptyTip:{
      type: String,
      default(){
        return 'not null'
      }
    }
  },
  data() {
    return {
      isSaving:false,
      mapInstance:null,
      showModal:false,
      errorInfo:'',
      positionInfo:{
        // addressName: "3308 Fallow Ave, Orient, 艾奥瓦州 50858, 美国"
        // country: "美国"
        // lat: 41.178043
        // lng: -94.597861
      },
      searchAddresses:[],
      showAutoAddress: false,
    }
  },
  watch:{
    positionInfo:{
      handler(value){
        this.errorInfo = this.positionInfo.addressName ? '' : this.emptyTip
      },
      deep:true
    },
    showModal(val){
      if(val){
        this.positionInfo = JSON.parse(JSON.stringify(this.initPositionInfo))
        this.loadMap()
      }
    }
  },
  created() {
    
  },
  mounted () {
    this.$on('positionInfo',(positionInfo)=>{
      this.positionInfo = positionInfo
      console.log(this.positionInfo)
    })
    this.$on('mapClick',()=>{
      this.setSearchPanelHeight()
    })
  },
  methods:{
    setSearchPanelHeight(){
      let dom = document.getElementsByClassName(this.isOverseas ? 'map-modal-body-act-search-res' : 'tangram-suggestion-main')[0]
      if(!dom) return
      let rect = this.$refs.mapSearchInput.$el.getBoundingClientRect()
      dom.scrollTop = 0
      dom.style.height = (window.innerHeight - rect.bottom - 8) + 'px'
      dom.style.overflow = 'overlay'
    },
    onSearchInputBlur(){
      setTimeout(()=>{
        this.showAutoAddress = false
      },300)
    },
    onSearchInput() {
		  if (!this.positionInfo.addressName) return
      this.setSearchPanelHeight()
		  this.mapInstance.search(this.positionInfo.addressName, (results)=> {
        this.searchAddresses = results
		    this.showAutoAddress = Boolean(results.length)
		  })
    },
		setPositionInfo(option){
			this.positionInfo = option
			this.setMarkLocation(this.positionInfo)
		},
    setMarkLocation(option) {
      this.mapInstance.setMarkLocation(option)
    },
    loadMap() {
      if(this.isOverseas){
        bingPromise().then((BingMap)=>{
          this.mapInstance = BingMap.getInstance(this,{
            domId:'#map-modal-body-main',
            showInfoWin:false,
            chooseSpots:true
          })
          this.setMarkLocation(this.positionInfo)
        })
      }else{
        baiduPromise().then((BaiduMap)=>{
          this.mapInstance = BaiduMap.getInstance(this,{
            domId:'map-modal-body-main',
            search:{
              initVal:this.positionInfo.addressName,
              domId:'map-modal-body-act-input'
            },
            showInfoWin:false,
            chooseSpots:true
          })
          this.setMarkLocation(this.positionInfo)
        })
      }
    },
    changeModal(){
      this.showModal = !this.showModal
      if(!this.showModal){
        this.reseModal()
      }
    },
    reseModal(){
      this.mapInstance && this.mapInstance.destroy && this.mapInstance.destroy()
      this.errorInfo = ''
    },
    submit(){
			if(this.errorInfo) return
      this.isSaving = true
      this.$emit('ok',this.positionInfo,(error)=>{
        this.isSaving = false
        if(!error){
          this.changeModal()
        }
      })
    }
  }
}
</script>
<style lang="less">
	.map-modal{
		&-panel{
			width: 60% !important;
			min-width: 520px;
			padding: 0;
			.ant-modal-footer{
				border-top: none;
			}
		}
		&-body{
			height: 66vh;
			display: flex;
			flex-direction: column;
			min-height: 200px;
			&-act{
				padding: 0 10px;
				height: 72px;
				background: hsla(0,0%,100%,.8);
				filter: contrast(90%);
				z-index: 1;
				&-search{
					&-res {
						border: 1px solid #c0c0c0;
						width: 100%;
						border-top: none;
						background: #fff;
					  ul, li {
					    margin: 0;
					    list-style: none;
					    color: #000;
					  }
					
					  li {
					    line-height: 32px;
					    color: #555;
					    padding-left: 10px;
					    cursor: pointer;
					
					    &:hover {
					      background: #ebebeb;
					    }
					  }
					}
				}
				&-input{
					margin: 0 auto;
					margin-top: 10px;
					padding-left: 0;
					background-color: #fff;
					text-indent: 6px;
					font-size: 14px;
					border: 1px solid rgba(0,0,0,.15);
					box-shadow: none;
					color: #333;
				}
				&-tip,&-error{
					padding: 1px 0;
					font-size: 12px;
				}
				&-tip{
					color: #333;
				}
				&-error{
					color: #de544d;
				}
			}
		}
	}
	.tangram-suggestion-main{
		z-index: 1000;
	}
</style>
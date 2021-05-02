let BaiduMap = function (vm,options) {
  this.vm = vm
  this.options = options || {}
  this.allMarkers = []
  this.map = this.getMap()
  this.location = this.getLocation(options.initLatlng || {})
  this.setCenter()
  this.infoWin = this.getInfoWin()
  this.geoc = new window.BMapGL.Geocoder()
  if(this.options.chooseSpots){
    this.marker = this.getMaker()
    this.map.addOverlay(this.marker)
    this.bindEvent()
    this.search()
  }
}
BaiduMap.prototype = {
  clearOverlays(){
    this.map.clearOverlays()
  },
  hideInfoWin(){
    this.infoWin.hide()
  },
  destroy(){
    this.mapSearch && this.mapSearch.dispose()
    this.map.destroy()
  },
  /**
   * [getMap description] 初始化地图
   * @return {[type]} [description]
   */
  getMap: function () {
    let map = new window.BMapGL.Map(this.options.domId,{
      enableMapClick:false,
      maxZoom:18
    })
    if(this.options.customMapStyle){
      map.setMapStyleV2({styleJson:this.options.customMapStyle})
    }
    map.enableScrollWheelZoom(true)
    map.enableKeyboard()
    map.enableInertialDragging()
    return map
  },
  /**
   * [getMaker description] 初始化marker
   * @return {[type]} [description]
   */
  getMaker: function () {
    let markIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAo9JREFUSInVlTtMFFEUhv97ZxaRBFATiCY0mhiNiWhHMLvAtgQKQkJhLMXCR2FhQmFj7A0xNlZSGeNWGonSyUOejcnyCEp8Lewq4j5mH7PzuOfauMu63lkGEwtPdef85/zfOXeSGeAfB9urIDHQ2QpHuw6gn0AnOXEmOd4Dclx3+IPWienEXwPifaFBInqkcdao0okoxxkfPjY+82TfgHhfaFBKGeGs9hAESA3y0tEXbx77BiQGOlulxT8yzhpqmZchkqw6DSdans/GqzWuahA2H6k0d0kikcvj3U4ys55MGfFcHkLKXRPGD5iuvK3yUgIkyYvlMyRiaSOWtYrd3fOrh3pmV5oN0w7HMpktWdkj2ZBvAGNoKZ2ztuVawu7qnlubKuXCCyuvXbAuo2iJUk7X+BHfAM7Zbl5iNbyw/qm6JjQT/QDCWnkoSOX7VAKKrqDyZCygq2oAoD6gaaWzLUiqatQAx9kum+ja6a/9wfbqms3eC+cDun6qYqikyks5nWHZY8319SOcMXAOToIm473BGwGdngGAI9iABO5z9mtACaRMK6LyUt7bdPDs4ea6wFZLQ8NBlV4dKbPgfss6x8OL0c1qTXlFoZloKmPZd11JKvm3ICmRNJ1RlbknAACyjcV7OzlTea+V8d00s05A3PHSPQG9rzasnO3csoXwKoFNhLRpjYQnV3P7BgBAcG55LJkvfPbSf+QLse22Mw9redQEMIAMx7pWdP/cwnQFMpZ9ZSgS8V4RPn44ALDU1f62ranpXGXui5Fe7Jha7tirt+YGpcg7YrjguOXnjG1L02aX/fT6AvTMrSxtm+aESxIOEdIF62nPfDTqp9fzO1MdLtHVjVT6JQCX6+Km377/P34C8D0vQGYk0UUAAAAASUVORK5CYII='
    let myIcon = new window.BMapGL.Icon(markIcon,new window.BMapGL.Size(24, 24), {
      anchor: new window.BMapGL.Size(12, 22)
    })
    let marker = new window.BMapGL.Marker(this.location, { icon: myIcon })
    marker.enableDragging()
    return marker
  },
  /**
   * [getInfoWin description] 初始化信息窗口
   * @return {[type]} [description]
   */
  getInfoWin: function () {
    return new window.BMapGL.InfoWindow('sdf', {
      width: 0,
      height: 0,
      enableMessage: false,
      offset: new window.BMapGL.Size(0, 0)
    })
  },
  getLocation: function (option) {
    let lng = option.lng || '116.404'
    let lat = option.lat || '39.915'
    return new window.BMapGL.Point(lng,lat)
  },
  /**
   * [setLocation description] 修改当前坐标
   * @param {[type]} option [description]
   */
  setLocation: function (option) {
    this.location.lat = option.lat
    this.location.lng = option.lng
    // this.location = this.getLocation(option)
  },
  setMarkLocation: function (option){
    this.setLocation(option)
    this.setMaker()
    setTimeout(()=>{
      this.setCenter()
    },50)
  },
  /**
   * [setMarkers description] 设置点标识
   * @param {[lng]} require 经度
   * @param {[lat]} require 纬度
   * @param {[icon]} option {src:icon地址,width:宽度,height:高度,options:参数}
   */
  setMarkers(markers){
    this.allMarkers = []
    for(let i=0;i<markers.length;i++){
      let icon = markers[i]['icon']
      let myIcon = ''
      if(icon){
        if(icon.src && icon.width && icon.height){
          myIcon = new window.BMapGL.Icon(icon.src, new window.BMapGL.Size(icon.width, icon.height),icon.options || {})
        }else if(icon.src){
          myIcon = new window.BMapGL.Icon(icon.src,icon.options || {})
        }
      }
      let pt = new window.BMapGL.Point(markers[i]['lng'], markers[i]['lat'])
      let marker = null
      if(myIcon){
        marker = new window.BMapGL.Marker(pt, { icon: myIcon })
      }else{
        marker = new window.BMapGL.Marker(pt)
      }
      marker.setZIndex(markers[i]['zIndex'])
      this.allMarkers.push(marker)
      this.map.addOverlay(marker)
    }
    let markersPosition = this.allMarkers.map(item=>{
      return item.latLng
    })
    this.map.setViewport(markersPosition,{margins:[0,350,0,350]})
    return new Promise((resolve)=>{
      resolve()
    })
  },
  setMaker: function () {
    this.marker.setPosition(this.location)
  },
  /**
   * [setInfoWin description] 重置窗口
   * @param {[type]} option [description]
   */
  setInfoWin: function (option) {
    if(!this.options.showInfoWin) return
    this.infoWin.setContent(this.vm.$t('map.lat') + ': ' + (option.lat || '') + '<br>' + this.vm.$t('map.lng') + ': ' + (option.lng || '') + '<br>' + this.vm.$t('map.address') + ': ' + (option.addressName || ''))
    this.marker.openInfoWindow(this.infoWin)
    this.infoWin.restore()
  },
  search: function(value) {
    if(this.mapSearch || !this.map || !this.options.search || (this.options.search && !this.options.search.domId)) return
	  this.mapSearch = new window.BMapGL.Autocomplete({
	    'input' : this.options.search.domId,
	    'location' : this.map
	  })
    this.mapSearch.addEventListener('onconfirm',(e)=>{
		  let _value = e.item.value
		  let searchVal = _value.province +  _value.city +  _value.district +  _value.street +  _value.business
		  let local = new window.BMapGL.LocalSearch(this.map, {
		    onSearchComplete: ()=>{
		      let pp = local.getResults().getPoi(0).point  //获取第一个智能搜索的结果
		      this.map.centerAndZoom(pp, 15)
		      this.setLocation(pp)
		      this.setMaker()
          this.vm.$emit('positionInfo',{
            addressName: searchVal,
            lat: pp.lat,
            lng: pp.lng
          })
		    }
		  })
		  local.search(searchVal)
    })
    //百度需要查询框内容，否则查询框赋值后视图为空
    this.mapSearch.setInputValue(this.options.search.initVal)
  },
  /**
   * [setCenter description]设置中心点和坐标
   */
  setCenter: function () {
    this.map.centerAndZoom(this.location, 1)
  },
  /**
   * 自动地位
   */
  geolocation() {
    const geolocation = new window.BMapGL.Geolocation()
    geolocation.getCurrentPosition(function(){
      if(this.getStatus() == window.BMapGL_STATUS_SUCCESS){
        
      }
      else {
        // alert('failed'+this.getStatus())
      }        
    })
  }, 

  getLocationByPoint (point) {
    const self = this
		self.vm.$emit('mapClick')
    self.geoc.getLocation(point, function (rs) {
      let addComp = rs.addressComponents
      let addressName = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
      let infoOption = { lat: rs.point.lat, lng: rs.point.lng, addressName: addressName }
      self.setInfoWin(infoOption)
      self.vm.$emit('positionInfo',infoOption)
    })
  },
  /**
   * [bindEvent description] 事件绑定
   * @return {[type]} [description]
   */
  bindEvent: function () {
    let self = this
    this.marker.addEventListener('dragend', function (e) {
      let pt = e.point
      self.setLocation({ lat: pt.lat, lng: pt.lng })
      self.getLocationByPoint(pt)
    })
    this.map.addEventListener('click', function (e) {
      let pt = e.latlng
      self.setLocation({ lat: pt.lat, lng: pt.lng })
      self.setMaker()
      self.getLocationByPoint(pt)
    })
  }
}
BaiduMap.getInstance = function (vm,options) {
  return new BaiduMap(vm,options)
}
/**
 * [loadApi description] 加载地图api， 请不要随意修改这个， 这个可以解决很多未知的bug
 * @return {[type]} [description]
 */
const loadApi = function (options) {
  let script = document.createElement('script')
  let key = 'nUxGAmKI7LGb613lVTloseW4' // vnnox EA1a9e07f21dc5480d791644d811cd59
  // script.src = `//api.map.baidu.com/api?v=2.0&ak=2.0&ak=${key}&t&callback=initializeBaidu`
  // script.src = `api.map.baidu.com/api?v=3.0&ak=${key}`
  script.src = `//api.map.baidu.com/api?callback=initializeBaidu&type=webgl&v=1.0&ak=${key}`
  document.body.appendChild(script)
}
const initializeBaidu = function (options) {
  options= options || {}
  if(!window.BMapGL){
    loadApi(options)
  }
  let timeCount = 0
  let checkTime = 200
  return new Promise((resolve) => {
    let time = setInterval(() => {
      timeCount += checkTime
      if(timeCount > 1000*60*5){
        clearInterval(time)
      }
      if(window.BMapGL && window.BMapGL.Map){
        clearInterval(time)
        setTimeout(() => {
          resolve(BaiduMap)
        }, 300)
      }
    }, checkTime)
  })
}

export default initializeBaidu
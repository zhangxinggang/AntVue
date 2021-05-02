import coordtransform from './coordtransform'
const BingMap = function(vm,options) {
  this.vm = vm
  this.options = options || {}
  this.searchManager = null
  this.allMarkers = []
  this.location = new window.Microsoft.Maps.Location(30, 110)
  this.map = this.getMap()
  this.infoWin = this.getInfoWin()
  if(this.options.chooseSpots){
    this.pin = this.getPin()
    this.map.entities.push(this.pin)
    this.bindEvent()
  }
}
BingMap.prototype = {
  clearOverlays(){
    for (var i = this.map.entities.getLength() - 1; i >= 0; i--) {
      var pushpin = this.map.entities.get(i)
      if (pushpin instanceof window.Microsoft.Maps.Pushpin) {
        this.map.entities.removeAt(i)
      }
    }
  },
  hideInfoWin: function(){
    this.infoWin.setOptions({
      visible: false
    })
  },
  destroy(){
    this.map.dispose()
  },
  createScaledPushpin(location, markerAttr, offsetPoint, callback) {
    let self = this
		let latLngTrans = coordtransform.bd09togcj02(location.lng,location.lat)
		let latAndLng = {
		  latitude:latLngTrans[1],
		  longitude:latLngTrans[0]
		}
    let options = {}
    let cb = ()=>{
      let pin = new window.Microsoft.Maps.Pushpin(latAndLng,options)
      callback(pin,latAndLng)
    }
    if(markerAttr.src){
      let img = new Image()
      img.onload = function () {
        let c = document.createElement('canvas')
        c.width = markerAttr.width,
        c.height = markerAttr.height
        let context = c.getContext('2d')
        context.drawImage(img, 0, 0, c.width, c.height)
        options.icon = c.toDataURL()
        offsetPoint.left && offsetPoint.top && (options.anchor = new window.Microsoft.Maps.Point(offsetPoint.left, offsetPoint.top))
        cb()
      }
      img.οnerrοr = cb
      img.src = markerAttr.src
    }else{
      cb()
    }
  },
  /**
   * [setMarkers description] 设置点标识
   * @param {[lng]} require 经度
   * @param {[lat]} require 纬度
   * @param {[icon]} option {src:icon地址,width:宽度,height:高度,options:参数}
   */
  setMarkers(markers){
    this.allMarkers = []
    this.map.entities.clear()
    let markersPosition = []
    let tempPin = []
    let count = 0
    return new Promise((resolve)=>{
      for(let i=0;i<markers.length;i++){
        let icon = markers[i]['icon']
        let markerAttr = {
          zIndex:markers[i]['zIndex']
        }
        icon.src && (markerAttr['src'] = icon.src)
        icon.width && (markerAttr['width'] = icon.width)
        icon.height && (markerAttr['height'] = icon.height)
        this.createScaledPushpin(markers[i],markerAttr,{...icon.options},(pushpin,latAndLng)=>{
          markersPosition.push(latAndLng)
          tempPin.push({
            index:i,
            zIndex:markers[i]['zIndex'] || 0,
            pin:pushpin
          })
          count++
          if(count === markers.length){
            tempPin.sort((a,b)=>{
              return a.zIndex >= b.zIndex ? -1 : 1
            })
            tempPin.forEach(item=>{
              this.map.entities.push(item.pin)
              this.allMarkers[item.index] = item.pin
            })
            let rect = window.Microsoft.Maps.LocationRect.fromLocations(markersPosition)
            this.map.setView({bounds: rect,padding: 90})
            resolve()
          }
        })
      }
    })
  },
  // setCenter: function() {
  //   var rect = window.Microsoft.Maps.LocationRect.fromLocations(this.allMarkers.length ? this.allMarkers : [this.location])
  //   this.map.setView({bounds: rect,padding: 100})
  // },
  // http://www.bingmap.cn/demos/cf6556d8-dafe-11e8-a789-d46d6d978bfa?module=demo
  /**
   * [getMap description]初始化地图
   * @return {[type]} [description]
   */
  getMap: function() {
    let keys = {
      '0': 'AgiEgZT3ohADiEDXUV3mYrapxa4spAzJ2VlKEfOmtHbYPbQba6M6412tY5E7RCjV', //中国
      '1': 'AtQAYzRKOLkdQDUbOfvtwjv3lCsDti4Wv6T93k9e-p_sRiDowb18zMiru0A1d-T_', //美国
      '2': 'AhU56uQxXH0EnsVVpEoHkDIRj3DANkgBym7eKC7DRHPWmqhLhJsnNGLban56VAmH', //澳大利亚
      '3': 'AtFecIOdbHqhwkLEPykAuhJNT337zgvzhx_17npDjc3-HLalQ6AS_Ao1_F6dNVvS', //欧洲
      '4': 'AoPm--uFMgBjsLg25nuQzq1qYwYhfssLZFkM1b-wfnta04E9EnIDEHPV7uuwysut' ,//日本
			'5': 'AlWdG5n68RQEQfaw933o_C2x6Zk-dvXMxrB0d8xhX6MpoKyNeWYRHF1BEEBUI2Mj' //新加波
    }
		// let keys = {
		//   '0': 'AnZG08_eZQiRKQyQpA9N7EDtcmbvK9MD1z-ml2dTE-JZkX2eo4hTkIdLFs3EerMx', //中国
		//   '1': 'ApwBzYMWsqcw5kvUfv0fCeelvF_OjrP6rVC4l82cNG4-CJXFSHqSaXL1r-KDvjxW', //美国
		//   '2': 'AlWdG5n68RQEQfaw933o_C2x6Zk-dvXMxrB0d8xhX6MpoKyNeWYRHF1BEEBUI2Mj' //新加波
		// }
    let host = window.location.host, key
    if (/us/gi.test(host)) {
      key = keys['1']
    } else if (/au/gi.test(host)) {
      key = keys['2']
    } else if (/eu/gi.test(host)) {
      key = keys['3']
    } else if (/jp/gi.test(host)) {
      key = keys['4']
    } else {
      // key = keys['0']
			key = keys['5']
    }
    let currentMap = new window.Microsoft.Maps.Map(this.options.domId, {
      customMapStyle: this.options.customMapStyle,
      credentials: key,
      center: this.location,
      mapTypeId: window.Microsoft.Maps.MapTypeId.road,
      zoom: 3,
      maxZoom:17,
      showDashboard: false
    })
    return currentMap
  },
  /**
   * [getInfoWin description] 初始化信息窗口
   * @return {[type]} [description]
   */
  getInfoWin: function() {
    let infobox = new window.Microsoft.Maps.Infobox(this.map.getCenter(), {
      visible: false,
      autoAlignment: false
    })
    infobox.setMap(this.map)
    return infobox
  },
  /**
   * [getPin description] 获取marker
   * @return {[type]} [description]
   */
  getPin: function() {  
    return new window.Microsoft.Maps.Pushpin(this.location, {
      icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAo9JREFUSInVlTtMFFEUhv97ZxaRBFATiCY0mhiNiWhHMLvAtgQKQkJhLMXCR2FhQmFj7A0xNlZSGeNWGonSyUOejcnyCEp8Lewq4j5mH7PzuOfauMu63lkGEwtPdef85/zfOXeSGeAfB9urIDHQ2QpHuw6gn0AnOXEmOd4Dclx3+IPWienEXwPifaFBInqkcdao0okoxxkfPjY+82TfgHhfaFBKGeGs9hAESA3y0tEXbx77BiQGOlulxT8yzhpqmZchkqw6DSdans/GqzWuahA2H6k0d0kikcvj3U4ys55MGfFcHkLKXRPGD5iuvK3yUgIkyYvlMyRiaSOWtYrd3fOrh3pmV5oN0w7HMpktWdkj2ZBvAGNoKZ2ztuVawu7qnlubKuXCCyuvXbAuo2iJUk7X+BHfAM7Zbl5iNbyw/qm6JjQT/QDCWnkoSOX7VAKKrqDyZCygq2oAoD6gaaWzLUiqatQAx9kum+ja6a/9wfbqms3eC+cDun6qYqikyks5nWHZY8319SOcMXAOToIm473BGwGdngGAI9iABO5z9mtACaRMK6LyUt7bdPDs4ea6wFZLQ8NBlV4dKbPgfss6x8OL0c1qTXlFoZloKmPZd11JKvm3ICmRNJ1RlbknAACyjcV7OzlTea+V8d00s05A3PHSPQG9rzasnO3csoXwKoFNhLRpjYQnV3P7BgBAcG55LJkvfPbSf+QLse22Mw9redQEMIAMx7pWdP/cwnQFMpZ9ZSgS8V4RPn44ALDU1f62ranpXGXui5Fe7Jha7tirt+YGpcg7YrjguOXnjG1L02aX/fT6AvTMrSxtm+aESxIOEdIF62nPfDTqp9fzO1MdLtHVjVT6JQCX6+Km377/P34C8D0vQGYk0UUAAAAASUVORK5CYII=',
      anchor: new window.Microsoft.Maps.Point(12, 22), //修正图钉的位置
      draggable: true
    })
  },
  /**
   * [setInfoWin description] 修改信息窗口
   * @param {[type]} option [description]
   */
  setInfoWin: function(option) {
    let self = this
    if(this.options.showInfoWin){
      this.infoWin.setOptions({
        location: self.location,
        description: self.vm.$t('map.lat') + ': ' + (option.lat || '') + '<br>' + self.vm.$t('map.lng') + ': ' + (option.lng || '')+ '<br>' + self.vm.$t('map.address') + ': ' + (option.addressName || ''),
        visible: true
      })
    }
  },
  setLocation: function (option) {
    option = option || {}
    !option.hasOwnProperty('lat') && (option.lat = 110)
    !option.hasOwnProperty('lng') && (option.lng = 30)
		let latAndLng = coordtransform.bd09togcj02(option.lng,option.lat)
    this.location = new window.Microsoft.Maps.Location(latAndLng[1],latAndLng[0])
  },
  setMarkLocation: function (option){
    this.setLocation(option)
    this.map.setView({
      center: this.location,
      zoom: this.map.getZoom()
    })
    this.pin.setLocation(this.location)
    this.setInfoWin(option)
  },
	getMapSearch(cb){
		let self = this
		if (!self.searchManager) {
		  window.Microsoft.Maps.loadModule('Microsoft.Maps.Search', function() {
		    self.searchManager = new window.Microsoft.Maps.Search.SearchManager(self.map)
		    cb()
		  })
		}else{
			cb()
		}
	},
  search: function(val, callback) { 
    var self = this
		self.getMapSearch(()=>{
			var searchRequest = {
			  where: val,
			  callback: function (r) {
			    r.results.forEach(item => {
						let latAndLng = coordtransform.gcj02tobd09(item.location.longitude,item.location.latitude)
			      item.latitude = latAndLng[1]
			      item.longitude = latAndLng[0]
			    })
			    callback(r.results)
			  },
			  errorCallback: function() {
			    callback([])
			  }
			}
			self.searchManager.geocode(searchRequest)
		})
  },
  /**
   * [bindEvent description] 地图的事件绑定
   * @return {[type]} [description]
   */
  bindEvent: function() {
    let self = this
    function reverseGeocode(loc) {
			self.pin.setLocation(loc)
			self.getMapSearch(()=>{
				let callback = (r)=>{
				  let po = self.location = r.location
					let latAndLng = coordtransform.gcj02tobd09(po.longitude,po.latitude)
				  let option = {lat: latAndLng[1], lng: latAndLng[0], addressName: r.name || ''}
					self.pin.setLocation(self.location)
					self.setInfoWin(option)
					self.vm.$emit('positionInfo',option)
				  self.vm.$emit('mapClick')
				}
				let searchRequest = {
				  location: loc,
				  callback: callback,
				  errorCallback: callback
				}
				self.searchManager.reverseGeocode(searchRequest)
			})
    }
    window.Microsoft.Maps.Events.addHandler(self.map, 'click', function(e) {
      reverseGeocode(e.location)
    })
    window.Microsoft.Maps.Events.addHandler(self.pin, 'drag', function() {
      self.infoWin.setOptions({visible: false})
    })
    window.Microsoft.Maps.Events.addHandler(self.pin, 'dragend', function(e) {
      reverseGeocode(e.location)
    })
  }
}
BingMap.getInstance = function(vm,options) {
  return new BingMap(vm,options)
}
/**
 * [loadApi description] 加载地图， 请不要随意修改，instead， you will have some bugs,and you can't find errors and resolve it.
 * @return {[type]} [description]
 */
const loadApi = function(options) {
  let lang = options.lang || 'en-US'
  let script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = `//www.bing.com/api/maps/mapcontrol?callback=initializeBing&setLang=${lang}`
  script.async = true
  script.defer = true
  document.body.appendChild(script)
}
const initializeBing = function(options) {
  options= options || {}
  if(!window.Microsoft){
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
      if(window.Microsoft && window.Microsoft.Maps && window.Microsoft.Maps.Location){
        clearInterval(time)
        setTimeout(() => {
          resolve(BingMap)
        }, 400)
      }
    }, checkTime)
  })
}
export default initializeBing
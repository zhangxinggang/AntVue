<template>
  <div class="fabric">
		<div style="display: flex;align-items: flex-end;">
			<div>
				发送卡极限宽：<a-input v-model.number="scMaxWidth" />
			</div>
			<div>
				发送卡极限高：<a-input v-model.number="scMaxHeight" />
			</div>
			<div>
				接收卡带载宽：<a-input v-model.number="rvWidth" />
			</div>
			<div>
				接收卡带载高：<a-input v-model.number="rvHeight" />
			</div>
			<div>
				行：<a-input v-model.number="row" />
			</div>
			<div>
				列：<a-input v-model.number="col" />
			</div>
			<div>
				<a-button type="primary" @click="renderCanvas">绘制</a-button>
			</div>
		</div>
		<div style="display: flex;">
			<div>
				走线方式：
				<a-radio-group v-model="drawStyle" button-style="solid" @change="renderCanvas">
					<a-radio-button value="LR">
						从左到右
					</a-radio-button>
					<a-radio-button value="TB">
						从上到下
					</a-radio-button>
				</a-radio-group>
			</div>
		</div>
		<div>
			<div>
				网线数：{{actualNetworkCables}}，
				一根网线画线最优带载数：{{oneCablesNum}}
			</div>
		</div>
		<div ref="canvas-contanier" style="border: 1px solid #f00;flex:1">
			<canvas id="fabric-canvas"></canvas>
		</div>
  </div>
</template>

<script>
import { fabric } from 'fabric'
import data from './data.js'
export default {
  name: 'fabric',
  data () {
    return {
			actualNetworkCables:0,
			scMaxWidth:1920,
			scMaxHeight:1080,
			rvWidth:192,
			rvHeight:128,
			row:5,
			col:4,
			fabricObj:null,
			drawStyle:'LR'
    }
  },
	computed:{
		oneCablesNum(){
			let limitCablesNum = Math.floor(650000/(this.rvWidth*this.rvHeight))
			if(limitCablesNum%2 != 0 && this.col!=1 && this.row!=1){
				limitCablesNum--
			}
			return limitCablesNum
		},
		oneBoxRvNum(){
			return {
				row:Math.floor(this.scMaxHeight/this.rvHeight),
				col:Math.floor(this.scMaxWidth/this.rvWidth)
			}
		}
	},
  methods: {
		setCanvas(){
			let canvas = document.getElementById('fabric-canvas')
			let contanier = this.$refs['canvas-contanier'].getBoundingClientRect()
			canvas.width = contanier.width
			canvas.height = contanier.height
		},
		addEvent(){
			this.fabricObj.on("mouse:down", (e)=> {
				this.panning = true
				this.fabricObj.selection = false
			})
			//鼠标抬起事件
			this.fabricObj.on("mouse:up", (e)=> {
				this.panning = false
				this.fabricObj.selection = true
			})
			// 移动画布事件
			this.fabricObj.on("mouse:move", (e)=> {
				if (this.panning && e && e.e) {
					let delta = new fabric.Point(e.e.movementX, e.e.movementY);
					this.fabricObj.relativePan(delta);
				}
			})
			// 鼠标滚动画布放大缩小
			this.fabricObj.on("mouse:wheel", (e)=> {
				let event = e.e
				var zoom = (event.deltaY > 0 ? -0.1 : 0.1) + this.fabricObj.getZoom()
				zoom = Math.max(0.1, zoom); //最小为原来的1/10
				zoom = Math.min(3, zoom); //最大是原来的3倍
				var zoomPoint = new fabric.Point(e.pointer.x,e.pointer.y)
				this.fabricObj.zoomToPoint(zoomPoint,zoom)
				event.preventDefault()
			})
		},
		getNumFactorization(obj){
			let factorizations = []
			let fNum = obj.col
			let drawStyleIsTB = this.drawStyle == 'TB'
			let networkCables = obj.networkCables
			if(drawStyleIsTB){
				fNum = obj.row
			}
			for(let i=1;i<fNum;i++){
				for(let j=fNum-1;j>0;j--){
					let purpose = drawStyleIsTB ? (i<=j) : (i>=j)
					if(purpose && i*j<=this.oneCablesNum && fNum/i<=networkCables){
						factorizations.unshift({
							widthNum:i,
							heightNum:j,
							sum:i*j
						})
					}
				}
			}
			factorizations.sort((a,b)=>{
				let addKey = drawStyleIsTB ? 'heightNum' : 'widthNum'
				let n = a.sum - b.sum
				if(n!==0){
					return n > 0 ? -1 : 1
				}
				return a[addKey] > b[addKey] ? -1 : 1
			})
			return factorizations
		},
		splitAreas(arr){
			let areas = []
			arr.forEach(obj=>{
				let networkCables = obj.networkCables
				let row = obj.row
				let col = obj.col
				let offsetX = obj.offsetX
				let offsetY = obj.offsetY
				if(networkCables){
					let drawStyleIsTB = this.drawStyle == 'TB'
					let optKey = drawStyleIsTB ? 'col' : 'row'
					let oneRectCalcNum = Math.floor(this.oneCablesNum/(drawStyleIsTB ? row : col))
					let oneArea = []
					for(let i=0;i<obj[optKey];i++){
						if(i%oneRectCalcNum == 0 && oneArea.length<obj[optKey]){
							let numCount = 0
							oneArea.forEach(item=>{ numCount+=item[optKey] })
							if(drawStyleIsTB){
								oneArea.push({
									row:row,
									col:oneRectCalcNum,
									offsetX:offsetX+numCount*this.rvWidth,
									offsetY:offsetY
								})
							}else{
								oneArea.push({
									row:oneRectCalcNum,
									col:col,
									offsetX:offsetX,
									offsetY:offsetY+numCount*this.rvHeight
								})
							}
						}
					}
					let lastArea = oneArea[oneArea.length-1]
					lastArea[optKey]=obj[optKey] - oneRectCalcNum*(oneArea.length-1)
					areas = areas.concat(oneArea)
				}
			})
			return areas
		},
		getScAreas(){
			let getScwh = (key)=>{
				let colles = []
				for(let i=1;i<this[key];i++){
					if(i%this.oneBoxRvNum[key]==0){
						colles.push(i)
						continue
					}else if(i==this[key]-1){
						colles.push(i)
					}
				}
				return colles
			}
			let rows = getScwh('row')
			let cols = getScwh('col')
			let areas = []
			for(let i=0;i<rows.length;i++){
				for(let j=0;j<cols.length;j++){
					let calcIndexX = rows[i-1] || 0
					let calcIndexY = cols[j-1] || 0
					areas.push({
						row:rows[i]-calcIndexX,
						col:cols[j]-calcIndexY,
						offsetX:calcIndexY*this.rvWidth,
						offsetY:calcIndexX*this.rvHeight
					})
				}
			}
			return areas
		},
		getAllAreas(){
			let scAreas = this.getScAreas()
			let areas = []
			let surplusAreas = []
			let getOneRectArea = (obj)=>{
				let row = obj.row
				let col = obj.col
				let theoryNetworkCables = Math.ceil(row*col/this.oneCablesNum)
				let oneCablesRowNum = Math.floor(this.oneCablesNum/col)
				let oneCablesColNum = Math.floor(this.oneCablesNum/row)
				if((oneCablesRowNum && (row/oneCablesRowNum <= theoryNetworkCables)) || (oneCablesColNum && (col/oneCablesColNum) <= theoryNetworkCables)){
					let boxAttr = {
						row:row,
						col:col,
						offsetX:obj.offsetX,
						offsetY:obj.offsetY,
						networkCables:theoryNetworkCables
					}
					surplusAreas = this.splitAreas([boxAttr])
				}else{
					let factorizations = this.getNumFactorization({row:row,col:col,networkCables:theoryNetworkCables})[0]
					let lWidthNum = factorizations.widthNum
					let lHeightNum = factorizations.heightNum
					let lRows = parseInt(row/lHeightNum)
					let rRows = row - lRows*lHeightNum
					let lCols = parseInt(col/lWidthNum)
					let rCols = col - lCols*lWidthNum
					// 最大线算
					for(let i=0;i<lCols;i++){
						let lOffsetX = lWidthNum*i*this.rvWidth+obj.offsetX
						let lOffsetY = obj.offsetY
						for(let j=0;j<lRows;j++){
							areas.push({
								row:lHeightNum,
								col:lWidthNum,
								offsetX:lOffsetX,
								offsetY:lOffsetY+j*lHeightNum*this.rvHeight
							})
						}
					}
					let box1Attr = {
						row:rRows,
						col:col,
						offsetX:obj.offsetX,
						offsetY:(row - rRows)*this.rvHeight+obj.offsetY
					}
					let box2Attr = {
						row:row - rRows,
						col:rCols,
						offsetX:(col - rCols)*this.rvWidth+obj.offsetX,
						offsetY:obj.offsetY
					}
					let rRowsNetworkCables = Math.ceil(box1Attr.row*box1Attr.col/this.oneCablesNum)
					let rColsNetworkCables = Math.ceil(box2Attr.row*box2Attr.col/this.oneCablesNum)
					let totalCables = rRowsNetworkCables+rColsNetworkCables+areas.length
					if(totalCables>theoryNetworkCables){
						box1Attr.col = col - rCols
						box1Attr.networkCables = Math.ceil(box1Attr.row*box1Attr.col/this.oneCablesNum)
						box2Attr.row = row
					}else{
						box1Attr.networkCables = rRowsNetworkCables
					}
					box2Attr.networkCables = theoryNetworkCables - areas.length - box1Attr.networkCables
					surplusAreas = this.splitAreas([box1Attr,box2Attr])
				}
				areas = areas.concat(surplusAreas)
			}
			for(let i=0;i<scAreas.length;i++){
				getOneRectArea(scAreas[i])
			}
			this.actualNetworkCables = areas.length
			return areas
		},
		randomColor() {
		  var color="rgb(";
		  for(var i=0;i<3;i++) color+=parseInt(Math.random()*256)+",";
		  //去除最后一个逗号
		  // color=color.slice(0,-1)
		  color=color.substring(0,color.length-1)+")";
		  return color;
		},
		drawRect(options){
			//参数：长个数，宽个数，起始点，索引，方向
			let rowNum = options.rowNum
			let colNum = options.colNum
			let x = options.x
			let y = options.y
			let drawStyle = options.drawStyle || 'LR' //'LR':从左到右,'TB':从上到下
			let index = options.index
			let eleObj = {
				rect:[],
				circle:[],
				lines:[],
				text:[],
				arrows:[]
			}
			let boxColor = this.randomColor()
			for(let i=0;i<colNum;i++){
				for(let j=0;j<rowNum;j++){
					let rect = new fabric.Rect({
						left: x+i*this.rvWidth,
						top: y+j*this.rvHeight,
						width: this.rvWidth,
						height: this.rvHeight,
						fill: boxColor,
						transparentCorners: false,
						stroke:'#000', 
						strokeWidth:1
					})
					eleObj.rect.push(rect)
					let textAttr = {
						left: x+i*this.rvWidth + 10,
						fontSize: 12
					}
					let pText = new fabric.Text(`P-${index+1}`, {
						top: y+(j+0.4)*this.rvHeight,
						...textAttr
					})
					let rvNum = 0
					if(drawStyle === 'TB'){
						rvNum = i*rowNum+j+1
						if(i%2 != 0){
							rvNum = rowNum-j-1+i*rowNum+1
						}
					}else{
						rvNum = i+j*colNum+1
						if(j%2 != 0){
							rvNum = colNum-i-1+j*colNum+1
						}
					}
					let rvText = new fabric.Text(`RV-${rvNum}`, {
						top: y+(j+0.6)*this.rvHeight,
						...textAttr
					})
					let wHText = new fabric.Text(`WH-${this.rvWidth}x${this.rvHeight}`, {
						top: y+(j+0.8)*this.rvHeight,
						...textAttr
					})
					eleObj.text.push(pText,rvText,wHText)
					let tranCondition = true
					if(drawStyle === 'TB'){
						if(colNum-1 == i){
							j==rowNum-1 && (tranCondition = false)
						}else{
							tranCondition = true
						}
					}else{
						if(rowNum-1 == j){
							i==colNum-1 && (tranCondition = false)
						}else{
							tranCondition = true
						}
					}
					if(tranCondition){
						let tTop = (j+0.5)*this.rvHeight - 12
						let tLeft = (i + 1)*this.rvWidth
						let tAngle = 90
						if(j%2!=0){
							tTop = (j+0.5)*this.rvHeight + 12
							tAngle = -90
						}
						if(drawStyle==='TB'){
							tTop = (j + 1)*this.rvHeight
							tLeft = (i + 0.5)*this.rvWidth + 14
							tAngle = 180
							if(i%2!=0){
								tLeft = (i + 0.5)*this.rvWidth - 12
								tAngle = 0
							}
							if(rowNum-1 === j){
								tAngle = 90
								if(i%2!=0){
									tTop = 0.5*this.rvHeight - 12
									tLeft = (i+1)*this.rvWidth
								}else{
									tTop = (rowNum - 0.5)*this.rvHeight - 12
									tLeft = (i + 1)*this.rvWidth
								}
							}
						}else{
							if(colNum-1 === i){
								tAngle = 180
								if(j%2!=0){
									tTop = (j + 1)*this.rvHeight
									tLeft = 0.5*this.rvWidth + 14
								}else{
									tTop = (j + 1)*this.rvHeight
									tLeft = (i + 0.5)*this.rvWidth + 14
								}
							}
						}
						var triangle = new fabric.Triangle({
							top : y+tTop,
							left : x+tLeft,
							width : 24,
							height : 24,
							angle: tAngle,
							fill : '#0a00ff',
							stroke: '#0a00ff',
							strokeWidth: 1
						})
						eleObj.arrows.push(triangle)
					}
					let circleColor = '#fff'
					if(rvNum == 1){
						circleColor = '#0f0'
					}else if(rvNum == rowNum*colNum){
						circleColor = '#f00'
					}
					let circle = new fabric.Circle({
						radius:8,
						left: x+(i + 0.5)*this.rvWidth - 7,
						top: y+(j + 0.5)*this.rvHeight - 7,
						fill:circleColor
					})
					eleObj.circle.push(circle)
				}
			}
			let drawLineNum = drawStyle == 'TB' ? colNum : rowNum
			for(let i=0;i<drawLineNum;i++){
				let startPointX = 0.5*this.rvWidth
				let startPointY = (i+0.5)*this.rvHeight
				let endPointX = (colNum - 0.5)*this.rvWidth
				let endPointY = (i + 0.5)*this.rvHeight
				if(drawStyle==='TB'){
					startPointX = (i + 0.5)*this.rvWidth
					startPointY = 0.5*this.rvHeight
					endPointX = (i + 0.5)*this.rvWidth
					endPointY = (rowNum - 0.5)*this.rvHeight
				}
				let line = new fabric.Line([x+startPointX,y+startPointY,x+endPointX,y+endPointY], {
					stroke: '#0a00ff',
					strokeWidth: 2,
					hasBorders: false
				})
				eleObj.lines.push(line)
				if(i!=drawLineNum-1){
					let sx = (colNum-0.5)*this.rvWidth
					let sy = (i+0.5)*this.rvHeight
					let ex = (colNum-0.5)*this.rvWidth
					let ey = (i+1+0.5)*this.rvHeight
					if(i%2 != 0){
						sx = 0.5*this.rvWidth
						ex = 0.5*this.rvWidth
					}
					if(drawStyle==='TB'){
						sx = (i + 0.5)*this.rvWidth
						sy = (rowNum - 0.5)*this.rvHeight
						ex = (i + 1 + 0.5)*this.rvWidth
						ey = sy
						if(i%2 != 0){
							sx = (i + 0.5)*this.rvWidth
							sy = 0.5*this.rvHeight
							ex = (i + 1 + 0.5)*this.rvWidth
							ey = sy
						}
					}
					let connectLine = new fabric.Line([x+sx,y+sy,x+ex,y+ey],{
						stroke: '#0a00ff',
						strokeWidth: 2,
						hasBorders: false
					})
					eleObj.lines.push(connectLine)
				}
			}
			return eleObj
		},
		renderCanvas(e){
			let zoom = this.fabricObj.getZoom()
			this.fabricObj.clear()
			this.fabricObj.remove(this.fabricObj.getActiveObject())
			this.fabricObj.setViewportTransform([1, 0, 0, 1, 0, 0])
			let areas = this.getAllAreas()
			let allEle = []
			for(let i=0;i<areas.length;i++){
				let eleObj = this.drawRect({
					rowNum: areas[i]['row'],
					colNum: areas[i]['col'],
					x:areas[i]['offsetX'],
					y:areas[i]['offsetY'],
					drawStyle:this.drawStyle,
					index:i
				})
				allEle = [...allEle,...eleObj.rect,...eleObj.lines,...eleObj.circle,...eleObj.text,...eleObj.arrows]
			}
			let group = new fabric.Group(allEle,{
				hasControls:false,
				hasBorders: false,
				top:0,
				left:0
			})
			this.fabricObj.setZoom(zoom)
			// this.fabricObj.centerObject(group)
			this.fabricObj.add(group)
		}
  },
	mounted(){
		this.setCanvas()
		fabric.perfLimitSizeTotal = 1025000000
		fabric.maxCacheSideLimit = 110000
		this.fabricObj = new fabric.Canvas('fabric-canvas',{
			isDrawingMode: false,
			selectable: false,
			selection: false,
			selectionColor: 'blue',
  		selectionLineWidth: 2,
			devicePixelRatio:10
		})
		this.addEvent()
		this.renderCanvas()
	}
}
</script>

<style lang="less" scoped>
	.fabric{
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
</style>sss
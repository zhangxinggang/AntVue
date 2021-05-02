图片
fabric.Image.fromURL('https://img1.baidu.com/it/u=3230928968,51834560&fm=26&fmt=auto&gp=0.jpg', (img) => {
	img.filters.push(new fabric.Image.filters.Sepia())
	new fabric.Image.filters.Brightness({ brightness: 100 })
	img.applyFilters()
	allEle.push(img)
}, {crossOrigin: 'anonymous'})
线
var line = new fabric.Line([25, 25, 325, 25], {
	fill: 'green',
	stroke: 'green',
	strokeWidth: 10,
	hasBorders: false
})
三角
var triangle = new fabric.Triangle({
	top : 15, //距离画布上边的距离
	left : 100, //距离画布左侧的距离，单位是像素
	width : 20, //矩形的宽度
	height : 10, //矩形的高度
	angle: 90,
	fill : 'red', //填充的颜色
	stroke: 'orange', // 边框原色
	strokeWidth: 1 // 边框大小
})
长方形
let rect = new fabric.Rect({
	hoverCursor:"auto",
	left: j*this.moduleWidth,
	top: i*this.moduleHeight,
	originX: 'left',
	originY: 'top',
	width: this.moduleWidth,
	height: this.moduleHeight,
	angle: 0,
	fill: 'red',
	transparentCorners: false,
	borderColor:'#fff',
	// hasControls:false,
	// selectable:false,
	hasBorders:true,
	padding:10
})
.setActiveObject(rect);
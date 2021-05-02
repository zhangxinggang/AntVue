### 图片定时滚动组件

### 如何使用
```
<pic-carousel :pictures="scenePicture"></pic-carousel>
```

### props

| 属性名              | required | type          | default        | 说明                                                              |
| ------------------- | -------- | ------------- | ---------------|------------------------------------------------------------------ |
| pictures            | false    | Array         | []             | 数组某一项 {id:'唯一标识',src:'图片地址',title:'图片名称'}         |
| previewType         | false    | String        | popup          | popup 鼠标移入，弹出框显示大图，tooltip，基于Antd Vue 鼠标移入提示 |
| title               | false    | String        |  ''            | 滚动图说明                                                        |
| direction           | false    | String        | left           | 滚动方向，left，right                                             |
| showEmptyPic        | false    | Boolean       | false          | 使用显示空数据图片                                                |
| spaceBetween        | false    | Number        | 15             | 图片之间的间距                                                    |
| scaleFocus          | false    | Boolean       | false          | 是否放大中心图片                                                  |
| autoplay            | false    | Boolean       | true           | 是否自动滚动                                                      |
| interval            | false    | Number        | 4000           | 滚动间隔，单位ms                                                  |
| total               | false    | Number        | 7              | 一次共显示多少张图片                                              |
| slidesPerGroup      | false    | Number        | 1              | 一次滚动多少张图片                                                |
| carouselBoxClass    | false    | String        | ''             | 自定义class                                                       |
| previewImgBoxAttr   | false    | Object        | { width: 520,height: 280,showTitle: true }| 每一张图片box属性                      |
| closeImg            | false    | String        | ''             | 当设置previewType为popup时，此值生效，关闭按钮样式                 |
| prevBtnImg          | false    | String        | '<'            | 上一张图片                                                         |
| nextBtnImg          | false    | String        | '>'            | 下一张图片                                                         |

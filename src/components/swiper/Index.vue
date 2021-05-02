<template>
  <div :class="['picture-carousel', carouselBoxClass ? carouselBoxClass : '']">
    <div class="picture-carousel-title">
      <span>{{ title }}</span>
    </div>
    <div
      :class="['picture-carousel-main',scaleFocus?'picture-carousel-main-scalefocus':'picture-carousel-main-default']"
      @mouseenter.stop="handleMouseEnter"
      @mouseleave.stop="handleMouseLeave"
    >
      <div
        key="prev"
        @click="prev"
        onselectstart="return false"
        :class="['picture-carousel-prev',clonePictures.length<=total?'picture-carousel-cursor-disabled':'']"
        :style="{
          height: previewImgBoxAttr.showTitle ? 'calc(100% - 30px)' : '100%'
        }"
      >
        <img v-if="prevBtnImg" :src="prevBtnImg" />
        <div v-else v-html="'<'"></div>
      </div>
      <transition-group
        name="list"
        tag="div"
        class="picture-carousel-swiper"
        :css="false"
        @before-enter="beforeEnter"
        @enter="enter"
        @before-leave="beforeLeave"
        @leave="leave"
      >
        <div
          class="picture-carousel-swiper-item"
          :style="{
            width: itemWidth,
            paddingLeft: (index == 0 ? spaceBetween : 0) + 'px',
            paddingRight: spaceBetween + 'px',
          }"
          v-for="(item, index) in list"
          :key="item.id"
        >
          <div v-show="showPicCarousel" :class="{ active: scaleFocus && index === Math.floor(total / 2) , 'picture-carousel-swiper-item-box':true}">
            <div v-if="item.src" class="picture-carousel-swiper-img">
              <template v-if="previewType=='tooltip'">
                <a-popover overlayClassName="picture-carousel-popover">
                  <template slot="content">
                    <img
                      :style="{width:`${previewImgBoxAttr.width}px`,height:`${previewImgBoxAttr.height}px`}"
                      :src="item.src"
                    />
                  </template>
                  <img
                    :class="['picture-carousel-swiper-img-item']"
                    :data-title="item.title"
                    :src="item.src"
                  />
                </a-popover>
              </template>
              <template v-else>
                <img
                  :class="['picture-carousel-swiper-img-item',currentSel.id==item.id?'picture-carousel-swiper-img-active':'']"
                  :data-title="item.title"
                  :src="item.src"
                  @click="selectedItem(item, index)"
                />
              </template>
            </div>
            <div
              v-else
              class="picture-carousel-swiper-nopic picture-carousel-swiper-img"
            ></div>
            <div
              v-if="previewImgBoxAttr.showTitle"
              :class="['picture-carousel-swiper-text',currentSel.id==item.id?'picture-carousel-swiper-img-text-active':'']"
            >
              {{ item.title }}
            </div>
          </div>
        </div>
      </transition-group>
      <div
        @click="next"
        onselectstart="return false"
        :class="['picture-carousel-next',clonePictures.length<=total?'picture-carousel-cursor-disabled':'']"
        :style="{
          height: previewImgBoxAttr.showTitle ? 'calc(100% - 30px)' : '100%',
        }"
      >
        <img v-if="nextBtnImg" :src="nextBtnImg" />
        <div v-else>></div>
      </div>
    </div>
  </div>
</template>

<script>
import Velocity from "velocity-animate"
export default {
  name: "PicCarousel",
  props: {
    previewType:{
      type: String,
      default(){
        return 'popup'
      }
    },
    direction:{
      type: String,
      default(){
        return 'left'
      }
    },
    title: {
      type: String,
      default() {
        return ""
      }
    },
    closeImg:{
      type:String,
      default(){
        return ''
      }
    },
    showEmptyPic: {
      type: Boolean,
      default() {
        return false
      }
    },
    scaleFocus: {
      type: Boolean,
      default() {
        return false
      }
    },
    spaceBetween: {
      type: Number,
      default() {
        return 15
      }
    },
    slidesPerGroup: {
      type: Number,
      default() {
        return 1
      }
    },
    prevBtnImg: {
      type: String,
      default() {
        return ""
      }
    },
    nextBtnImg: {
      type: String,
      default() {
        return ""
      }
    },
    previewImgBoxAttr: {
      type: Object,
      default() {
        return {
          width: 520,
          height: 280,
          showTitle: true
        }
      }
    },
    carouselBoxClass: {
      type: String,
      default() {
        return ""
      }
    },
    pictures: {
      type: Array,
      default: () => {
        return []
      }
    },
    total: {
      tyep: Number,
      default: 7
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    },
  },
  watch: {
    pictures(val) {
      this.popoverStop()
      this.itemWidth = 100 / this.total + "%"
      this.clonePictures = []
      this.showPicCarousel=false
      if (this.showEmptyPic) {
        this.clonePictures = JSON.parse(JSON.stringify(val));
      } else {
        this.clonePictures = val.filter((item) => {
          return item.src
        });
      }
      console.log(this.clonePictures,2342)
      this.formatterPictures()
    },
    immediate: true
  },
  data() {
    return {
      clonePictures: [],
      list: [],
      currentSel: {},
      timer: null,
      itemWidth: "",
      isReverse: false,
      showPicCarousel:false
    };
  },
  methods: {
    enoughPic(){
      let picCount = 0
      this.clonePictures.forEach((item) => {
        item.src && picCount++
      })
      return picCount > this.total
    },

    formatterPictures() {
      let cpl=this.clonePictures.length
      if (cpl < this.total) {
        let addItem=Array.apply(null,Array(this.total - cpl)).map(item=>{
          return {
            src: "",
            title: ""
          }
        })
        this.clonePictures=this.clonePictures.concat(addItem)
      }
      //��֤��id
      this.clonePictures.forEach((item, index) => {
        if (!item.id) {
          item.id = "temp_" + (Math.random() * 1000000).toString() + index
        }
      })
      this.list.length=0
      this.list.push(...this.clonePictures.slice(0, this.total))
      setTimeout(()=>{
        this.showPicCarousel=true
        this.popoverStart()
      },300)
    },

    // ��һ��
    next() {
      let totalLen = this.clonePictures.length
      if ( totalLen <= this.total) {
        return;
      }
      let indexOfItems = this.clonePictures.findIndex(
        (item) => item.id === this.list[this.list.length - 1].id
      )
      for(let i=0;i<this.slidesPerGroup;i++){
        let index=i+indexOfItems+1
        index = index > (totalLen - 1) ? (index - totalLen ) : index
        this.list.push(this.clonePictures[index])
      }
      this.list.splice(0,this.slidesPerGroup)
      this.isReverse = false
    },

    // ��һ��
    prev() {
      let totalLen = this.clonePictures.length
      if ( totalLen <= this.total) {
        return;
      }
      let indexOfItems = this.clonePictures.findIndex(
        (item) => item.id === this.list[0].id
      )
      for(let i=0;i<this.slidesPerGroup;i++){
        let index=indexOfItems-i-1
        index = index < 0 ? (totalLen+index) : index
        this.list.unshift(this.clonePictures[index])
      }
      this.list.splice(this.list.length-this.slidesPerGroup,this.slidesPerGroup)
      this.isReverse = true
    },

    // ���ͼƬ
    selectedItem(item, index) {
      this.$emit("selectedItem", item, index)
      this.currentSel=JSON.parse(JSON.stringify(item))
      this.addPopover(item)
    },

    clearEvent(){
      document.getElementsByClassName("picture-carousel-popover")[0] && document.getElementsByClassName("picture-carousel-popover")[0].remove()
      document.getElementsByClassName("picture-carousel-popover-close-btn")[0] && document.getElementsByClassName("picture-carousel-popover-close-btn")[0].removeEventListener("click", this.removePopover)
    },

    addPopover(item) {
      this.clearEvent()
      this.popoverStop()
      this.$nextTick(() => {
        let div = document.createElement("div")
        div.className = "picture-carousel-popover"
        div.style.cssText += `
          position:absolute;
          left:50%;
          top:45%;
          width:40%;
          height:45%;
          transform:translate(-50%,-50%);
          background: #fff;
          box-shadow: 0px 9px 16px rgba(0, 0, 0, 0.25);
          z-index:9999
        `;
        div.innerHTML = `<img class="picture-carousel-popover-img" src=${window.encodeURI(item.src)}>`;
        let closeBtn = document.createElement("div");
        closeBtn.innerHTML = `
          <div
            style="line-height: 48px;
            color: #fff;
            font-weight: 500;
            font-size: 18px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-align: center;
            padding: 0 80px;">${item.title}</div>
          ${this.closeImg?'<img class="picture-carousel-popover-close-btn" src='+this.closeImg+' />':'<div class="picture-carousel-popover-close-btn picture-carousel-popover-close-btn-text">x</div>'}
        `
        closeBtn.className = "picture-carousel-popover-close"
        div.appendChild(closeBtn)
        document.body.appendChild(div)
        document.getElementsByClassName("picture-carousel-popover-close-btn")[0] && document.getElementsByClassName("picture-carousel-popover-close-btn")[0].addEventListener("click", this.removePopover);
      })
    },

    removePopover() {
      this.clearEvent()
      this.currentSel=Object.create(null)
      this.popoverStart()
    },

    popoverStart() {
      this.popoverStop()
      if (!this.enoughPic() || this.currentSel.id || !this.interval || this.interval <= 0) {
        return
      }
      this.timer = setInterval(this.direction=='left'?this.next:this.prev, this.interval)
    },

    popoverStop() {
      this.timer && clearInterval(this.timer)
    },

    handleMouseEnter() {
      this.popoverStop()
    },

    handleMouseLeave() {
      this.autoplay && this.popoverStart()
    },

    // �б����� beging
    beforeEnter(el) {
      if(!this.showPicCarousel) return
      // ֻ��image-itemʹ�ù���
      let isImageItem =
        el.className.indexOf("picture-carousel-swiper-item") > -1;
      if (isImageItem) {
        el.style.opacity = 0;
        if (this.isReverse) {
          el.style.transform = "translateX(-100%)";
        } else {
          el.style.transform = "translateX(100%)";
        }
      }
    },
    
    enter(el, done) {
      // ֻ��image-itemʹ�ù���
      let isImageItem =
        el.className.indexOf("picture-carousel-swiper-item") > -1;
      if (isImageItem) {
        Velocity(el, { opacity: 1, translateX: "0px" }, { complate: done });
      } else {
        done();
      }
    },

    beforeLeave(el) {
      if(!this.showPicCarousel){
        el.style.display = 'none'
        return
      }
      // ֻ��image-itemʹ�ù���
      let isImageItem =
        el.className.indexOf("picture-carousel-swiper-item") > -1;
      if (isImageItem) {
        el.style.position = "absolute";
        if (this.isReverse) {
          el.style.right = 0;
        } else {
          el.style.left = 0;
        }
      }
    },

    leave(el, done) {
      // ֻ��image-itemʹ�ù���
      let isImageItem =
        el.className.indexOf("picture-carousel-swiper-item") > -1;
      if (isImageItem) {
        el.style.opacity = 0;
        if (this.isReverse) {
          el.style.right = `-${this.itemWidth}`;
          // el.style.transform = 'translateX(100%)'
        } else {
          el.style.transform = "translateX(-100%)";
        }
        setTimeout(done, 1000);
      } else {
        done();
      }
    },
    // �б����� end
  },
  mounted() {
    this.handleMouseLeave()
    this.formatterPictures()
  },
  beforeDestroy(){
    this.clearEvent()
    this.popoverStop()
  }
};
</script>

<style lang="less">
.picture-carousel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  &-main {
    flex: 1;
    display: flex;
    justify-content: center;
    width: 100%;
    &-scalefocus{
      height: calc(100% - 60px);
      margin-bottom: 10px;
    }
    &-default{
      height: calc(100% - 50px);
    }
  }

  &-title {
    text-align: center;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
  }

  &-swiper {
    height: 100%;
    width: calc(100% - 48px);
    position: relative;
    display: flex;
    z-index: 1;
    &-item {
      height: 100%;
      flex: 1;
      cursor: pointer;
      transition: all 1s;
      z-index:1;
      .active {
        transform: scale(1.14);
        z-index: 2
      }
      &-box{
        width: 100%;
        height: 100%;
      }
    }

    &-img {
      flex: 1;
      height: calc(100% - 30px);
      width: 100%;

      &-active {
        border: 2px solid #2fc25b;
        filter: drop-shadow(0px 0px 15px rgba(47, 194, 91, 0.3));
        background: radial-gradient(
          50% 50% at 50% 50%,
          rgba(9, 21, 42, 0) 0%,
          rgba(9, 21, 42, 0.19) 100%
        );
      }
      &-text-active {
        color: #329966;
        font-size: 14px;
        font-weight: 500;
      }
      img {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }

    &-nopic {
      flex: 1;
      background: radial-gradient(
        50% 50% at 50% 50%,
        rgba(9, 21, 42, 0) 0%,
        rgba(9, 21, 42, 0.19) 100%
      );
      border: 1px solid #e3e3e3;
    }

    &-text {
      text-align: center;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      white-space: nowrap;
      height: 30px;
      line-height: 30px;
    }
  }

  &-prev,
  &-next {
    width: 24px;
    background: rgba(227, 227, 227, 0.35);
    border: 1px solid #e3e3e3;
    box-sizing: border-box;
    transform: matrix(1, 0, 0, -1, 0, 0);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 2;
    &:focus {
      outline: none;
    }
  }

  &-popover{
    .ant-popover-inner-content{
      padding:0 !important;
    }
    &-closeBtn {
      bottom: -10px;
      border-top-color: transparent;
      border-right-color: #fff;
      border-bottom-color: #fff;
      border-left-color: transparent;
      -webkit-box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.07);
      -moz-box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.07);
      box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.07);
      position: absolute;
      display: block;
      width: 20px;
      height: 20px;
      background: transparent;
      border-style: solid;
      border-width: 10px;
      -moz-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      -o-transform: rotate(45deg);
      transform: rotate(45deg);
      left: 50%;
      -webkit-transform: translateX(-50%) rotate(45deg);
      -moz-transform: translateX(-50%) rotate(45deg);
      -ms-transform: translateX(-50%) rotate(45deg);
      -o-transform: translateX(-50%) rotate(45deg);
      transform: translateX(-50%) rotate(45deg);
    }

    &-img {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    &-close {
      position: absolute;
      top: 0;
      left: 0;
      height: 48px;
      width: 100%;
      background: rgba(0, 0, 0, 0.35);
      &-btn{
        right: 16px;
        top: 16px;
        position: absolute;
        cursor:pointer;
        &-text{
          color: #fff;
          top: 0;
          font-size: 26px;
        }
      }
    }
  }
  &-cursor-disabled{
    cursor: not-allowed;
  }
}
</style>
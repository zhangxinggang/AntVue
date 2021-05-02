<template>
  <div style="text-align: center; margin-top: 48px;height:160px">
    <pic-carousel :title="'轮播图片示例'" :pictures="pictures" />
  </div>
</template>

<script>
import PicCarousel from "@/components/swiper/Index";

export default {
  data() {
    return {
      pictures: [],
    };
  },
  components: { PicCarousel },
  methods: {},
  mounted() {
    let pics = [
      "https://img0.baidu.com/it/u=3153405721,1524067674&fm=26&fmt=auto&gp=0.jpg",
      "https://img2.baidu.com/it/u=1016296651,1935046393&fm=26&fmt=auto&gp=0.jpg",
      "https://img2.baidu.com/it/u=2549605555,2288383931&fm=26&fmt=auto&gp=0.jpg",
      "https://img0.baidu.com/it/u=3348901843,1771497252&fm=26&fmt=auto&gp=0.jpg",
      "https://img2.baidu.com/it/u=2343602782,3373475189&fm=26&fmt=auto&gp=0.jpg",
      "https://img0.baidu.com/it/u=2913287666,2010318971&fm=26&fmt=auto&gp=0.jpg",
      "https://img2.baidu.com/it/u=2975346021,1706812188&fm=26&fmt=auto&gp=0.jpg",
      "https://img1.baidu.com/it/u=1935577893,4092708806&fm=26&fmt=auto&gp=0.jpg",
      "https://img0.baidu.com/it/u=2474992498,2867548152&fm=26&fmt=auto&gp=0.jpg",
    ];
    this.pictures = pics.map((item, index) => {
      return {
        id: index + 1,
        src: item,
        title: index + 1,
      }
    })
  },
};
</script>
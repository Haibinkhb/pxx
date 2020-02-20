<template>
<div class="hot_swiper">
    <div class="swiper-container">
      <!-- {{homecarousel}} -->
      <div class="swiper-wrapper" v-if="homecarousel.length">
        <div class="swiper-slide" v-for="(carousel,index) in homecarousel" :key="index">
          <a class="image-link" :href="carousel.detail">
            <img v-lazy="carousel.imgurl" />
          </a>
        </div>
      </div>
      <!-- 如果需要分页器 -->
      <div class="swiper-pagination"></div>
   </div>
</div>
</template>


<script>
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import { mapState } from "vuex";
export default {
  methods:{
   
  },
  computed: {
    ...mapState(["homecarousel"]),
  },
  mounted() {
    this.$nextTick(() => {
      this.$store.dispatch("req_homecarousel");
    });
  },
  watch: {
    homecarousel() {
      this.$nextTick(() => {
        new Swiper(".swiper-container", {
          loop: true, // 循环模式选项
          autoplay: true,
          // 如果需要分页器
          pagination: {
            el: ".swiper-pagination"
          }
        });
      });
    },
    openHotScroll:function(){
      console.log(this.openHotScroll);
      
      if(this.openHotScroll){
        this.$refs.hot.style.overflow = "scroll"
      }
    },
  }
}
</script>

<style>
.hot_swiper{
  margin-top: 50px;
  max-width:414px;
}
.swiper-container {
  margin-top: 50px;
  background-color: #fff;
  z-index: 1;
}
.image-link{
  display: block;
}
.image-link img{
  width: 100%;
  max-height: 156px;
  object-fit: cover
}
</style>

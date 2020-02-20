<template>
  <div class="tab-bottom">
    <div class="content" @click="changeRouter('/home')">
      <img :src="this.$route.path.includes('/home')?this.imgSrc[0].selected:this.imgSrc[0].normal" alt="">
      <div :class="this.$route.path.includes('/home')? 'tab-txt-selected':'tab-txt'" >首页</div>
    </div>
    <div class="content" @click="changeRouter('/recommend')">
      <img :src="this.$route.path.includes('/recommend')?this.imgSrc[1].selected:this.imgSrc[1].normal" alt="">
      <div :class="this.$route.path.includes('/recommend')? 'tab-txt-selected':'tab-txt'" >推荐</div>
    </div>
    <div class="content" @click="changeRouter('/search')">
      <img :src="this.$route.path.includes('/search')?this.imgSrc[2].selected:this.imgSrc[2].normal" alt="">
      <div :class="this.$route.path.includes('/search')? 'tab-txt-selected':'tab-txt'" >搜索</div>
      </div>
    <div class="content" @click="changeRouter('/chat')">
      <img :src="this.$route.path.includes('/chat')?this.imgSrc[3].selected:this.imgSrc[3].normal" alt="">
      <div :class="this.$route.path.includes('/chat')? 'tab-txt-selected':'tab-txt'" >购物车</div>
    </div>
    <div class="content" @click="changeRouter('/mine')">
      <img :src="this.$route.path.includes('/mine')?this.imgSrc[4].selected:this.imgSrc[4].normal" alt="">
      <div :class="this.$route.path.includes('/mine')? 'tab-txt-selected':'tab-txt'" >个人中心</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tab-bottom',
  data(){
    return{
      //tab选中的图片
      imgSrc:[
        {normal:require('../../static/img/icon_home.png'),
        selected:require('../../static/img/icon_home_selected.png')
        },
        {normal:require('../../static/img/icon_intro.png'),
        selected:require('../../static/img/icon_intro_selected.png')
        },
        {normal:require('../../static/img/icon_search.png'),
        selected:require('../../static/img/icon_search_selected.png')
        },
         {normal:require('../../static/img/icon_chat.png'),
        selected:require('../../static/img/icon_chat_selected.png')
        },
         {normal:require('../../static/img/icon_mine.png'),
        selected:require('../../static/img/icon_mine_selected.png')
        },
      ]
    }
  },
  methods: {
    changeRouter(path){
      this.$router.replace(path);
    }
  }
}
</script>

<style>
    .tab-bottom{
      position: fixed;
      bottom: 0;
      display: flex;
      height: 50px;
      min-height: 50px;
      width: 100%;
      max-width: 414px;
      z-index: 10;
      background-color: #fff;
    }
    .content{
      flex: 1;
      text-align: center
      }

    .content img{
      width: 24px;
      height: 24px;
      margin-top: 5px;
      margin-bottom: -3px;
    }
    .tab-txt{ 
     color: #777;
     font-size: 14px;
    }
    .tab-txt-selected{
      color: red;
      font-size: 14px;
    }
    
</style>

<template>
  <div class="hotNav">
    <div class="nav-content">
      <ul class="nav-items">
        <li class="item-content">
          <div class="item-container" id="navWidth" v-for="(nav,index) in beforeNav" :key="index">
            <div>
              <img v-lazy="nav.iconurl" id="imgWidth">
            </div>
            <span>{{nav.icontitle}}</span>
          </div>
        </li>
        <li class="item-content">
          <div class="item-container" v-for="(nav,index) in afterNav" :key="index">
            <div>
              <img v-lazy="nav.iconurl" ref="navWith">
            </div>
            <span>{{nav.icontitle}}</span>
          </div>
        </li>
      </ul>
      <div class="progressBg" v-if="false">
        <div class="progress" :style="delProgress"></div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { mapState } from "vuex";
export default {
  data() {
    return {
      screenWidth:
        window.innerWidth || document.body.clientWidth || window.screen.availWidth, //屏幕宽度
      navWidth: "", //内容长度
      progressBgWidth: "", //进度条背景长度
      progressBarWidth: "", //进度条长度(this.screenWidth/this.navWidth)*this.progressBgWidth
      navSlide: "", //鼠标移动距离
      progressSlide: "", //(this.navSlide/this.navWidth)*this.progressBgWidth;
      beforeNav: [],
      afterNav: [],
    };
  },
  methods: {
    //移动端事件监听
    bindEvent() {
      this.$el.addEventListener("touchstart", this.itemTouchStart);
      this.$el.addEventListener("touchmove", this.itemTouchMove);
      this.$el.addEventListener("touchend", this.itemTouchEnd);
    },
    //开始触摸
    itemTouchStart(event) {
      //获取触摸位置
      let touch = event.touches[0].pageX;
      this.startDel = touch;
      this.end = this.progressSlide || 0;
      //console.log(this.end);
    },
    //开始移动
    itemTouchMove(event) {
      //计算移动距离
      let silde = event.touches[0].pageX;
      let move = silde - this.startDel;

      this.navSlide = - parseInt(move) ;
      //处理进度调
      //console.log(this.navSlide);
      
      this.progressSlide =
        (this.navSlide / this.navWidth) * this.progressBgWidth + this.end;
      //console.log(this.progressSlide);
      
      //边界处理
      if (this.progressSlide < 0) {
        this.progressSlide = 0;
      } else if (
        this.progressSlide >
        this.progressBgWidth - this.progressBarWidth
      ) {
        this.progressSlide = this.progressBgWidth - this.progressBarWidth;
      }
      //console.log(this.progressBarWidth);
      
    },
    //结束触摸
    itemTouchEnd(event) {
      this.end = this.progressSlide;
      //console.log(this.end);
    }
  },
  computed: {
    ...mapState(["homenav"]),
    //处理进度调样式
    delProgress() {
      return {
        width: `${this.progressBarWidth}px`,
        left: `${this.progressSlide}px`
      };
    },
    delHomenav(){
      
    }
  },
  mounted() {
    //this.delHomenav();
    //调用actions
    this.$store.dispatch("req_homenav");
     
    //绑定事件
    this.bindEvent();
    //获取处理进度条所需数据
    this.$nextTick(function() {
     
    });
    
  },
  watch: {
    //处理homenav
    homenav() {
      this.$nextTick(() => {
        for (let i = 0; i < this.homenav.length; i++) {
          if (i <= this.homenav.length / 2 - 1) {
            this.beforeNav.push(this.homenav[i]);
          } else {
            this.afterNav.push(this.homenav[i]);
          }
        }
      
      });
      
    },
  },
  updated(){
    this.navWidth = $(".item-container").width() * 8; //获取nav内容总长度
     this.progressBgWidth = $(".progressBg").width(); //获取进度条背景长度
      this.progressBarWidth =
        (this.screenWidth / this.navWidth) * this.progressBgWidth; //求出进度条前景长度;
        
  }
};
</script>


<style>
.nav-items::-webkit-scrollbar { width: 0 !important }
.nav-items { -ms-overflow-style: none; }
.nav-items { overflow: -moz-scrollbars-none; }


.hotNav {
   max-width:414px;
  background-color: #fff;
  z-index: 1;
}
.nav-content {
 
  height: 100%;
  overflow: hidden;
}
.nav-items::-webkit-scrollbar {
  width: 0 !important;
}
.nav-items {
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
  word-break: keep-all;
  white-space: nowrap;
  text-overflow: ellipsis;
 
}
.nav-items .item-content {
  display: flex;
  margin: 10px 0;
}
.nav-items .item-content:last-child {
  margin-bottom: 5px;
}
.nav-items .item-content .item-container {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  width: 20%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.item-container div {
  width: 50%;
  height: 50%;
}
.item-container img {
  width: 100%;
  margin-bottom: 5px;
}
.item-container span {
  font-size: 12px;
  color: #666;
}
.progressBg {
  position: relative;
  margin-bottom: 3px;
  bottom: 3px;
  left: 50%;
  margin-left: -12.5%;
  width: 25%;
  background-color: #e5e5e5;
  height: 3px;
}
.progress {
  background-color: orangered;
  width: 60%;
  height: 100%;
  position: absolute;
  left: 0;
}
</style>

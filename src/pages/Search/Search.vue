<template>
  <div class="serarch">
    <router-view></router-view>
    <div class="searchTop">
      <div class="searchTop-content">
        <a class="searchTop-link" @click="changeRouter('/search/search_bar')">
          <i class="iconfont">&#xe708;</i>
          <span>搜索</span>
        </a>
      </div>
    </div>
    <div class="searchContent" v-if="search_data">
      <div class="searchLeft" ref="leftWrapper">
        <ul class="searchLeft-content">
          <li
            class="searchIteam"
            v-for="(search,index) in search_data"
            :key="index"
            :class="{'current':clicked===index}"
            v-on:click="currented(index)"
            ref="leftLi"
          >{{search.name}}</li>
        </ul>
      </div>
      <div class="searchRight" ref="rightWrapper">
        <ul class="searchRigntContent">
          <li
            class="contentList"
            ref="rightLi"
            v-for="(searchItem,keys) in search_data"
            :key="keys"
          >
            <div class="searchRight-top">
              <div class="topTitle">{{searchItem.name}}</div>
              <div class="topMore">
                <a href>查看更多 ></a>
              </div>
            </div>

            <div class="searchRight-bottom">
              <ul class="bottomContent">
                <li class="bottomIteam" v-for="(items,index2) in searchItem.items" :key="index2">
                  <div class="iteamImg">
                    <img v-lazy="items.icon" alt />
                  </div>
                  <span class="iteamText">{{items.title}}</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Bscroll from "better-scroll";
import searchBar from "./searchBar";
import { mapState } from "vuex";
export default {
  data() {
    return {
      clicked: 0,
      rightLiOffsetTop: [47,474,902,1231,1560,1792,2121,2548,2877,3207, 3536, 3865, 4195, 4524, 4853, 5085, 5316, 5645], //右侧li 的 offsetTop
      leftLiOffsetTop: [47,104,161,218,275,332,389,446,503,560, 617, 674, 731, 788, 845, 902, 959, 1016] //左侧li 的 offsetTop
    };
  },
  computed: {
    ...mapState(["search_data"])
  },
  mounted() {
    let search_data = this.$store.dispatch("req_search_data");
    this.$nextTick(() => {
      //this.getRightLiOffsetTop();
      //this.getLeftLiOffsetTop();
      //右侧bscroll实列
      if (!this.rightScroll) {
        this.rightScroll = new Bscroll(this.$refs.rightWrapper, {
          probeType: 3
        });
        //监听右侧列表滚动事件
        this.rightScroll.on("scroll", pos => {
          for (let i = 0; i < this.rightLiOffsetTop.length; i++) {
            if (
              -pos.y >= this.rightLiOffsetTop[i] + 47&& 
              -pos.y < this.rightLiOffsetTop[i + 1] 
            ) {
              this.clicked = i+1; //左侧选中样式切换
              this.leftScroll.scrollToElement(this.$refs.leftLi[this.clicked], 0);
             }else if(-pos.y > this.rightLiOffsetTop[this.rightLiOffsetTop.length-2] +200&&
              -pos.y < this.rightLiOffsetTop[this.rightLiOffsetTop.length-1]){
                
                  this.clicked = this.rightLiOffsetTop.length-1; //左侧选中样式切换
                  this.leftScroll.scrollToElement(this.$refs.leftLi[this.clicked], 0);
             }else if(-pos.y>=0&&-pos.y<this.rightLiOffsetTop[0]){
                this.clicked = 0; //左侧选中样式切换
              this.leftScroll.scrollToElement(this.$refs.leftLi[this.clicked], 0);
             }
          }
        });
      }
      //左侧bscroll实列
      if (!this.leftScroll) {
        this.leftScroll = new Bscroll(this.$refs.leftWrapper, {
          click:true,
          probeType: 3,
        });
      }
    });
  },
  methods: {
    //获取rightScroll每个Li 的offsetTop
    getRightLiOffsetTop() {
      let rightLi = Array.from(this.$refs.rightLi);
      for (let i = 0; i < rightLi.length; i++) {
        this.rightLiOffsetTop.push(rightLi[i].offsetTop);
      }
    },
    //获取leftScroll每个Li 的offsetTop
    getLeftLiOffsetTop() {
      for (let i = 0; i < this.$refs.leftLi.length; i++){
        this.leftLiOffsetTop.push(this.$refs.leftLi[i].offsetTop);
        //console.log(this.leftLiOffsetTop);
      }
    },
    //切换路由
    changeRouter(path) {
      this.$router.replace(path);
    },
    //左侧菜单点击事件
    currented(index) {
      this.rightScroll.scrollToElement(this.$refs.rightLi[index],0);
      this.clicked = index;
    }
  }
};
</script>

<style>
@import url("./icons/font/demo.css");
/*
  URL为项目内调用字体的路径
*/
@font-face {
  font-family: "iconfont"; /* project id 1039363 */
  src: url("//at.alicdn.com/t/font_1039363_bd4jyzhdddw.eot");
  src: url("//at.alicdn.com/t/font_1039363_bd4jyzhdddw.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_1039363_bd4jyzhdddw.woff2") format("woff2"),
    url("//at.alicdn.com/t/font_1039363_bd4jyzhdddw.woff") format("woff"),
    url("//at.alicdn.com/t/font_1039363_bd4jyzhdddw.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_1039363_bd4jyzhdddw.svg#iconfont") format("svg");
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.serarch {
  max-width: 414px;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
}
.searchTop {
   max-width: 414px;
  border-bottom: 1px solid #ddd;
  width: 100vw;
  height: 8vh;
  background-color: #fff;
  z-index: 998;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.searchTop .searchTop-content {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  width: 90%;
  height: 80%;
  background-color: #f1f1f1;
  text-align: center;
}
.searchTop-content > .searchTop-link {
  width: 100%;
  height: 100%;
  display: inline-block;
  text-align: center;
  line-height: 45px;
  color: #9c9c9c;
}
.searchTop-content > .searchTop-link span {
  margin-left: 5px;
  font-size: 18px;
}
.searchContent {
  width: 100%;
  height: 90%;
  background-color: #f1f1f1;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  margin-bottom: 60px;
}
/* 左边 */
.searchContent .searchLeft {
  width: 24%;
  height: 100%;
  background-color: rgb(250, 250, 250) !important;
  z-index: 997;
  overflow: hidden;
  font-size: 14px;
}
.searchLeft > .searchLeft-content {
  /* padding-bottom: 30px; */
  display: flex;
  flex-direction: column;
  background-color: rgb(250, 250, 250);
}
.searchLeft-content .searchIteam {
  width: 100%;
  height: 5%;
  text-align: center;
  line-height: 57px;
  font-weight: lighter;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 选中 */
.current {
  background-color: #fff;
  color: #e02e24;
}
.current::before {
  line-height: 58px;
  content: "";
  width: 3px;
  height: 30px;
  position: absolute;
  left: 0;
  background-color: #e02e24;
}
/* 右边 */
.searchRight {
  background-color: #fff;
  width: 76%;
  z-index: 997;
  height: 100%;
  margin-bottom: 60px;
}
.searchRight .searchRigntContent {
  list-style: none;
  width: 100%;
}
.searchRigntContent .contentList:last-child {
  padding-bottom: 40vh;
  box-sizing: border-box;
}
.searchRigntContent li {
  list-style: none;
  width: 100%;
  background-color: #fff;
  padding-bottom: 10px;
}
.searchRigntContent .searchRight-top {
  width: 100%;
  height: 26px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 26px;
}
.searchRight-top .topTitle {
  padding-left: 20px;
  font-weight: lighter;
}
.searchRight-top .topMore {
  padding-right: 10px;
}
.searchRight-top .topMore > a {
  text-decoration: none;
  color: #9c9c9c;
}
.searchRight-center {
  width: 100%;
  height: 88px;
  background-color: #fff;
  box-sizing: border-box;
  padding: 0 13px;
  margin-bottom: 22px;
}
.searchRight-center img {
  width: 100%;
  height: 100%;
}
.searchRight-bottom {
  width: 100%;
}
.bottomContent {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.bottomContent .bottomIteam {
  display: relative;
  display: block;
  width: 33%;
  padding-bottom: 16px;
}
.iteamImg {
  text-align: center;
  width: 60%;
  height: 74%;
  margin: 0 20% 4% 20%;
  box-sizing: border-box;
}
.iteamImg img {
  width: 100%;
}
.bottomIteam .iteamText {
  width: 100%;
  text-align: center;
  font-size: 14px;
  display: block;
}
</style>
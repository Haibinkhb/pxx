<template>
  <div class="hot" ref="hot">
    <mescroll-vue
      ref="mescroll"
      class="hotShops"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    >
     <HotSwiper></HotSwiper>
      <HotNav></HotNav>
      <HotAd></HotAd>
      <ul class="shopsList" v-if="dataList">
        <li class="shopItem" v-for="goods in dataList" :key="goods.goods_id">
          <a :href="baseUrl+goods.link_url" id="toShopA">
            <div class="shopContent">
              <div class="shopContent_left">
                <img v-lazy="goods.hd_thumb_url" alt />
              </div>

              <div class="shopContent_right">
                <div class="shopRight_top">{{goods.goods_name}}</div>
                <div class="shopRight_center"></div>
                <div class="shopRight_bottom">
                  <div class="shoprRemarks">
                    <span></span>
                    <span>退货包运费</span>
                  </div>
                  <div class="shopPrice">
                    <span class="priceLoge">￥</span>
                    {{goods.price|filterPrice}}
                    <span>{{goods.sales_tip}}</span>
                    <div class="shopUser">
                      <img src="../../imgs/shop_list/user1.jpg" alt />
                      <img src="../../imgs/shop_list/user2.jpg" alt />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </mescroll-vue>
      
</div>
</template>

<script>
import HotNav from "./HotNav"
import HotAd from "./HotAd";
import HotSwiper from "./HotSwiper";

import { mapState } from "vuex";
import MescrollVue from "mescroll.js/mescroll";
import axios from "axios";


export default {
  data() {
    return {
      baseUrl: "http://mobile.yangkeduo.com/",
      ScrollTop: 0,
      openScroll: true,
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        callback: this.downCallback,
        use: false
      }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
        //避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        //这就是为什么无更多数据有时候不显示的原因
        toTop: {
          //回到顶部按钮
          src: "./static/mescroll/mescroll-totop.png", //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "xxid", //父布局的id (1.3.5版本支持传入dom元素)
          icon: "./static/mescroll/mescroll-empty.png", //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        }
      },
      dataList: [] // 列表数据
    };
  },
  beforeRouteEnter(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },
  methods: {
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    // changHotScroll(openScroll){
    //   this.openScroll != this.openScroll;
    // },
    HotScroll() {
      this.openScroll != this.openScroll;
    },
    downCallback() {
      //下拉回调
      this.$emit("HotScroll", this.openScroll);
      this.ScrollTop = this.mescroll.getScrollTop();
      this.mescroll.endByPage();
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback(page, mescroll) {
      // 联网请求
      axios
        .get("https://pdd.haibinkhb.com/api/goodslist", {
          params: {
            offset: (page.num - 1) * page.size, // 页码
            count: page.size // 每页长度
          }
        })
        .then(response => {
          // 请求的列表数据
          let arr = response.data.results;
          // 如果是第一页需手动置空列表
          if (page.num === 1) this.dataList = [];
          // 把请求到的数据添加到列表
          this.dataList = this.dataList.concat(arr);
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length);
          });
        })
        .catch(e => {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr();
        });
    }
  },
  components: {
    MescrollVue, 
    HotNav,
    HotAd,
    HotSwiper,
  },
  computed: {
    ...mapState(["home_goodslist"])
  },
  filters: {
    filterPrice(price) {
      let tempPeice = price / 100;
      return tempPeice.toFixed(2);
    }
  }
};
</script>

<style>
.hot{
  max-width:414px;
  height: 100%;
}
.mescroll::-webkit-scrollbar { width: 0 !important }
.mescroll { -ms-overflow-style: none; }
.mescroll { overflow: -moz-scrollbars-none; }
.mescroll-totop {
  display: block;
  margin-bottom: 20vh;
}
.shopsList {
  max-width:414px;
  height: 100%;
  background-color: #f5f5f5;
}
.shopItem {
  background-color: #fff;
  margin: 5px;
  list-style: none;
}
#toShopA {
  display: block;
  text-decoration: none;
  position: relative;
}
.shopContent {
  height: 100%;
  width: 100%;
  display: flex;
}
/* 左边 */
.shopContent_left {
  flex-shrink: 0;
  width: 40%;
  height: 100%;
}
.shopContent_left img {
  width: 100%;
  height: 100%;
}

/* 右边 */
.shopContent_right {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0px 5px;
  box-sizing: border-box;
}
.shopContent_right .shopRight_top {
  width: 100%;
  height: 44px;
  font-weight: 600;
  margin-top: 5px;
  font-size: 14px;
  line-height: 22px;
  color: #333;
  overflow: hidden;
}
.shopRight_center {
  margin-top: 5px;
  font-size: 12px;
  color: #838383;
}
.shopRight_bottom {
  width: 60%;
  position: absolute;
  bottom: 10px;
}
.shoprRemarks {
  font-weight: bold;
  margin-bottom: 15px;

  color: #ff5706;
  font-size: 12px;
}
.shoprRemarks span {
  background-color: rgba(255, 87, 6, 0.08);
}
.shoprRemarks span {
  margin-left: 5px;
}
.shopPrice {
  color: #e02e24;
  font-weight: bolder;
  font-size: 15px;
}
.shopPrice .priceLoge {
  color: #e02e24;
  font-weight: bold;
  font-size: 12px;
}
.shopPrice span {
  color: #9c9c9c;
  font-size: 12px;
}
.shopRight_bottom .shopUser {
  width: 50px;
  height: 25px;
  display: flex;
  position: absolute;
  right: 0px;
  bottom: 0px;
}
.shopRight_bottom .shopUser img {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-left: -8px;
}
</style>

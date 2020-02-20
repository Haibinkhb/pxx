<template>
  <div class="recommend" >
    <mescroll-vue ref="mescroll" class="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <ul class="recommend_goods" v-if="dataList">
        <li class="recommend_goods_list" v-for="goods in dataList" :key="goods.goods_id">
          <div class="goods">
            <div class="goods_img">
              <img v-lazy="goods.hd_thumb_url" />
            </div>
            <div class="goods_name">
              <p>{{goods.goods_name}}</p>
            </div>
           <div class="center_box">
              <div class="goods_tags">退货无忧</div>
             <div class="sales_tip">{{goods.sales_tip}}</div>
           </div>
            <div class="goods_bottom">
              <div class="goodsPrice">
                <span class="goods_price_logo">￥</span>{{goods.price|filterPrice}}
              </div>
              <div class="find_button" @click="AddGoodsToCart(goods)">加入购物车</div>
            </div>
          </div>
        </li>
      </ul>
    </mescroll-vue>
  </div>
</template>

<script>
import{addGoodsToCart} from "./../../api/index"
import { mapState } from "vuex";
import $ from "jquery"; //引入jquery..
import axios from "axios";
import MescrollVue from "mescroll.js/mescroll";
import { Toast ,MessageBox} from "mint-ui";
export default {
  data() {
    return {
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 //每页数据条数,默认10
        },
        htmlNodata:<p class="upwarp-nodata">-- END --</p>,
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
  components: {
    MescrollVue // 注册mescroll组件
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
    //添加商品至购物车
    async AddGoodsToCart(goods){
      if(!this.userInfo.usersId){
        MessageBox.confirm("您需要登录后才能执行此操作").then(action => {
            if (action === "confirm") {
              this.$router.replace('/loginPanel');
            }
          });
      }else{
        let results = await addGoodsToCart(goods);
        console.log(results)
        await Toast({
           message: results.meessage,
            position: "center",
            duration: 1200
        })
      }
    },
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback(page, mescroll) {
      // 联网请求
      axios
        .get("https://pdd.haibinkhb.com/api/recommend", {
          params: {
            offset: (page.num-1) * page.size, // 页码
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
  computed: {
    ...mapState(["recommend_goods","userInfo"])
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
.mescroll {
  position: fixed;
  top: 0;
  bottom: 0;
  height: auto;
  max-width:414px;
}
.mescroll::-webkit-scrollbar { width: 0 !important }
.mescroll { -ms-overflow-style: none; }
.mescroll { overflow: -moz-scrollbars-none; }
.mescroll-totop{
    bottom: 10vh;
}
.recommend {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.scroller {
  width: 100%;
  height: 100%;
}
.recommend_goods {
  list-style: none;
  width: 100%;
  padding-bottom: 60px;
  display: flex;
  flex-wrap: wrap;
}
.recommend_goods_list {
  width: 48%;
  background: #fff;
}
.recommend_goods_list:nth-child(even) {
  margin-left: 2%;
}
.goods {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}
.goods_img {
  width: 100%;
}
.goods_img img {
  width: 100%;
}
.goods .goods_name {
  width: 100%;
}
.goods_name p {
  overflow: hidden;
  height: 18px;
  line-height: 18px;
  font-size: 13px;
  font-weight: 450;
  margin: 4px 5px;
}
.goods_tags {
  margin: 3px 4px;
  color: #ff5706;
  background-color: rgba(255, 87, 6, 0.08);
  font-size: 12px;
}
.center_box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1vw 1vh 0;
}
.goods_bottom {
  display: flex;
  justify-content: space-between;
  line-height: 18px;
  width: 100%;
}
.goods_price_logo {
  color: #e02e24;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
}
.goods_bottom .goodsPrice {
  font-weight: bolder;
  font-size: 14px;
  line-height: 18px;
  color: #e02e24;
}
.find_button {
  color: #fff;
  font-size: 14px;
  background: linear-gradient(to right, #ff8400, #ff5100);
  border-radius: 2px;
  line-height: 18px;
  padding: 0 1vw;
  margin: 0 1vw 1vh 0;
}
.sales_tip {
  color: #9c9c9c;
  font-size: 12px;
}
</style>

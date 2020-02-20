<template>
  <div id="app">
    <keep-alive >
    <router-view></router-view>
    </keep-alive>
    <tabBottom v-if="this.$route.meta.showTabBootom"></tabBottom>
  </div>
</template>

<script>
import tabBottom from "../src/components/Tab-bottom";
import { MessageBox } from "mint-ui";
export default {
  name: "App",
  components: {
    tabBottom
  },
  created() {
    this.$store.dispatch("getUserInfo");
  },
  mounted() {
  //   this.$nextTick(() => {
  //     let clientWidth = document.documentElement.clientWidth;
  //     if (clientWidth > 414) {
  //       MessageBox({
  //         title: "温馨提示",
  //         message:
  //           "检测到您当前可能正在使用pc端访问该网页，为了您能有更好的体验请打开浏览器的调试工具（通常是F12键）切换到手机模式访问",
  //         showCancelButton: false
  //       });
  //     }
  //   });
   }
};
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f5f5f5;
  box-sizing: border-box;
  
}
.mescroll-totop {
  display: none;
}
</style>

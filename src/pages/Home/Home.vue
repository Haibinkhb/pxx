<template>
  <div class="home">
    <ly-tab 
    v-model="selectedId"
    :items="items"
    :options="options"
    @change=changeRoute
    class="fixd"
    >
    </ly-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
  
</template>

<script>

export default {
  data () {
    return {
      selectedId: 0,
      items: [
        {label: '热门'},
        {label: '女装'},
        {label: '内衣'},
        {label: '母婴'},
        {label: '百货'},
        {label: '鞋包'},
        {label: '手机'},
        {label: '男装'},
        {label: '电器'}
      ],
      options: {
        activeColor: 'red'
        // 可在这里指定labelKey为你数据里文字对应的字段
      },
      //二级路由地址
      routerSrc:['/home/hot','/home/women_s','/home/underwear','/home/m_b',
      '/home/department','/home/s_b','/home/mobile','/home/men_s','/home/electric'
      ]
    }
  },
  methods: {
    changeRoute(){
      this.$router.replace(this.routerSrc[this.selectedId]);
    }
  },
}
</script>

<style>
  .fixd{
    position: fixed;
    top: 0;
    z-index: 998 !important;
    font-size: 16px;
    width: 100%;
    max-width:414px;
  }
</style>

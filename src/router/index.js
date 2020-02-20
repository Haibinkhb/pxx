import Vue from 'vue'
import Router from 'vue-router'

//一级路由
// import Home       from '../pages/Home/Home.vue'
// import Recommend  from '../pages/Recommend/Recommend.vue'
// import Search     from '../pages/Search/Search.vue'
// import Chat       from '../pages/Chat/Chat.vue'
// import Mine       from '../pages/Mine/Mine.vue'
// import loginPanel from '../pages/login/loginPanel.vue'


const Home       = ()=> import ('./../pages/Home/Home.vue')
const Recommend  = ()=> import ('../pages/Recommend/Recommend.vue')
const Search     = ()=> import ('../pages/Search/Search.vue')
const Chat       = ()=> import ('../pages/Chat/Chat.vue')
const Mine       = ()=> import ('../pages/Mine/Mine.vue')
const loginPanel = ()=> import ('../pages/login/loginPanel.vue')

//主页板块二级路由
import Hot from '../../src/pages/Home/Children/Hot/Hot.vue'
import Women_s from '../../src/pages/Home/Children/Women_s.vue'
import Underwear from '../../src/pages/Home/Children/Underwear.vue'
import M_B from '../../src/pages/Home/Children/M_B.vue'
import Department from '../../src/pages/Home/Children/Department.vue'
import S_B from '../../src/pages/Home/Children/S_B.vue'
import Mobile from '../../src/pages/Home/Children/Mobile.vue'
import Men_s from '../../src/pages/Home/Children/Men_s.vue'
import Electric from '../../src/pages/Home/Children/Electric.vue'

//搜索板块二级路由
import searchBar from '../pages/Search/searchBar.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name:'home',
      component: Home,
      meta:{showTabBootom:true},
      redirect: '/home/hot' ,
      children:[
        { path: 'hot',component: Hot,name:'hot',meta:{showTabBootom:true}},
        { path: 'women_s',component: Women_s,meta:{showTabBootom:true}},
        { path: 'underwear',component: Underwear,meta:{showTabBootom:true}},
        { path: 'm_b',component: M_B,meta:{showTabBootom:true}},
        { path: 'department',component: Department,meta:{showTabBootom:true}},
        { path: 's_b',component: S_B,meta:{showTabBootom:true}},
        { path: 'mobile',component: Mobile,meta:{showTabBootom:true}},
        { path: 'men_s',component: Men_s,meta:{showTabBootom:true}},
        { path: 'electric',component: Electric,meta:{showTabBootom:true}},
       
      ]
    },
    {
      path: '/recommend',
      component: Recommend,
      meta:{showTabBootom:true}
    },
    {
      path: '/search',
      component: Search,
      meta:{showTabBootom:true},
      children:[
        {path:'search_bar',component:searchBar}
      ]
    },
    {
      path: '/chat',
      component: Chat,
      meta:{showTabBootom:true}
    },
    {
      path: '/mine',
      component: Mine,
      meta:{showTabBootom:true}
    },
    {
      path:'/loginPanel',
      component: loginPanel,
    },
    {
      path: '/',
      redirect: {name:'home'}
    },
    
  ]
})

import ajax from './ajax'

//定义一个基础路径
const base_url = "/api";
const local_url = 'https://pdd.haibinkhb.com'

//请求首页轮播图
export const get_homecarousel = () => ajax(local_url + "/api/homecarousel");

//请求首页导nav图
export const get_homenav = ()=>ajax(local_url + "/api/homenav");

//请求首页商品列表
export const get_goodslist = ()=>ajax(local_url + "/api/goodslist");

//请求推荐页商品列表
export const get_recommend_goods = (params)=>ajax(local_url + "/api/recommend",params);

//请求搜索页数据
export const get_search_data = ()=>ajax(local_url + "/api/search");

//获取手机短信验证码
export const get_phoneCode = (phone)=>ajax(local_url + "/api/getPhoneCode", {phone:phone});

//手机验证码登录
export const phoneCodeLogin = (phone,code)=>ajax(local_url + "/api/phoneCodeLogin",{phone,code},'POST');

//用户名密码登录
export const userNameLogin = (userName,password,identifyingCode)=>ajax(local_url + "/api/userNameLogin",{userName,password,identifyingCode},'POST');

//获取用户信息
export const getUserInfo = ()=>ajax(local_url + "/api/getUserInfo");

//添加商品至购物车
export const addGoodsToCart = (goods)=>ajax(local_url + "/api/addGoodsToCart",goods,'POST');

//获取购物车商品数据
export const CartDate = ()=>ajax(local_url + "/api/getCartDate",'GET');

//删除购物车商品数据
export const deleteGoodsData = (goods)=>ajax(local_url + "/api/deleteGoods",goods,'POST');

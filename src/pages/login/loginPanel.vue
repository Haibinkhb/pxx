<template>
  <div class="Panel">
    <div class="chooseMode">
      <div class="content">
        <div class="contentTop">
          <div :class="{choose:loginWay}" @click="chooseLogin()">手机登录</div>
          <div :class="{choose:!loginWay}" @click="chooseLogin()">用户名登录</div>
        </div>
        <form action>
          <div class="userName" v-if="!loginWay">
            <label>
              <input type="text" placeholder="用户名" v-model="userName" />
            </label>
            <label>
              <input type="password" placeholder="密码" v-model="password" />
            </label>
            <label class="verification">
              <input type="text" placeholder="验证码" v-model="identifyingCode" />
              <img
                ref="captcha"
                src="http://139.155.126.152:3000/api/getCaptcha"
                class="verificationImg"
                @click="changeCaptcha()"
              />
            </label>
          </div>
          <div class="phone_login" v-else-if="loginWay">
            <label for class="phone">
              <input type="phone" placeholder="手机号" v-model="phone" />
              <button
                v-if="!count"
                class="getCode"
                :class="{phoneRight:validatePhone}"
                @click.prevent="sendCode"
              >获取验证码</button>
              <button disabled="disabled" v-else class="getCode">已发送({{count}}s)</button>
            </label>
            <label for>
              <input class="phoneCode" type="tel" placeholder="验证码" v-model="phoneCode" />
            </label>
          </div>
          <div class="loginButton">
            <button class="login_button" @click.prevent="login">登录</button>
            <button class="back_button" @click.prevent="$router.back('/login')">返回</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  get_phoneCode,
  phoneCodeLogin,
  userNameLogin
} from "./../../api/index.js";
import { mapActions, mapState } from "vuex";
import { Toast, MessageBox } from "mint-ui";
export default {
  data() {
    return {
      loginWay: true,
      userName: "", //用户名
      password: "", //登录密码
      identifyingCode: "", //验证码
      phone: "", //手机号码
      phoneCode: "", //手机短信验证码
      count: 0 //倒计时
    };
  },
  methods: {
    changeRouter(path) {
      this.$router.replace(path);
    },
    ...mapState(["userInfo"]),
    ...mapActions(["syncUserInfo"]),
    //选择登录方式
    chooseLogin() {
      this.loginWay = !this.loginWay;
      if (!this.loginWay) {
        MessageBox.confirm(
          "强烈推荐您使用手机号码登录，用户名登陆当前存在严重问题..."
        ).then(action => {
          if (action === "confirm") {
            this.loginWay = !this.loginWay
          }
        });
      }
    },
    //切换验证码
    changeCaptcha() {
      this.$refs.captcha.src =
        "http://139.155.126.152:3000/api/getCaptcha?time=" + new Date();
    },
    //获取验证码按钮的点击事件
    async sendCode() {
      if (!this.validatePhone) {
        return;
      }
      //更改按钮样式（倒计时）
      else if (this.validatePhone) {
        this.count = 30;
        let intervalId = setInterval(() => {
          this.count--;
          if (this.count === 0) {
            clearInterval(intervalId);
          }
        }, 1000);
      }
      //获取验证码
       this.phoneCode = parseInt(await get_phoneCode(this.phone));
    },
    async login() {
      //登录模式
      if (this.loginWay) {
        //手机号码登陆
        if (!this.phone) {
          Toast({
            message: "请输入手机号码",
            position: "center",
            duration: 3000
          });
          return;
        } else if (!this.validatePhone) {
          Toast({
            message: "请输入正确的手机号码",
            position: "center",
            duration: 3000
          });

          return;
        } else if (!this.phoneCode) {
          Toast({
            message: "请输入验证码",
            position: "center",
            duration: 3000
          });
          return;
        } else if (!/^\d{6}$/gi.test(this.phoneCode)) {
          Toast({
            message: "请输入正确的验证码",
            position: "center",
            duration: 3000
          });
          return;
        } else {
          //前端验证通过
          let results = await phoneCodeLogin(this.phone, this.phoneCode);

          if (results.errorCode === 1) {
            Toast({
              message: results.meessage,
              position: "center",
              duration: 3000
            });
          } else if (results.successCode !== 200) {
            Toast({
              message: "登录失败",
              position: "center",
              duration: 3000
            });
          } else {
            console.log(results);
            
            this.syncUserInfo(results);
            await this.changeRouter("/mine");
            Toast({
            message: "登录成功",
            position: "center",
            duration: 3000
          });
          }
        }
      } else {
        //用户名&密码登录
        if (!this.userName) {
          Toast({
            message: "请输入用户名",
            position: "center",
            duration: 3000
          });
          return;
        } else if (!this.password) {
          Toast({
            message: "请输入密码",
            position: "center",
            duration: 3000
          });
          return;
        } else if (!this.identifyingCode) {
          Toast({
            message: "请输入验证码",
            position: "center",
            duration: 3000
          });
          return;
        } else {
          //前端验证通过
          let results = await userNameLogin(
            this.userName,
            this.password,
            this.identifyingCode
          );
          if (results.errorCode === 1) {
            Toast({
              message: results.meessage,
              position: "center",
              duration: 3000
            });
            this.changeCaptcha();
          } else if (results.successCode !== 200) {
            Toast({
              message: "登录失败",
              position: "center",
              duration: 3000
            });
            this.changeCaptcha();
          } else {
            
            this.syncUserInfo(results);
            await this.changeRouter("/mine");
            Toast({
            message: "登录成功",
            position: "center",
            duration: 3000
          });
          }
        }
      }
    }
  },
  computed: {
    //验证手机号码是否合理
    validatePhone() {
      return /^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.phone);
    }
  }
};
</script>

<style>
.Panel {
  width: 100%;
  background-color: #f4f4f4;
  z-index: 10;
}
.chooseMode {
  width: 100%;
}
.content {
  font-style: normal;
  font-size: 18px;
  position: relative;
  top: 0;
  left: 0;
}
.contentTop {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 40px;
  color: #9c9c9c;
  padding-top: 3vh;
  box-sizing: border-box;
  background-color: #fff;
}
.contentTop div {
  line-height: 30px;
  width: 50%;
  height: 100%;
  text-align: center;
}
.choose {
  color: #e02e24;
  border-bottom: 1px solid #e02e24;
  font-weight: bolder;
}
.userName {
  width: 100%;
  margin: 3vh 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border: 1px solid #e6e6e6;
  border-left: none;
}
.userName label {
  box-sizing: border-box;
  width: 100%;
  padding-left: 8%;
  height: 8vh;
}
.userName label input {
  width: 100%;
  height: 100%;
  border: none;
  font-size: 18px;
  border-bottom: 1px solid #e6e6e6;
  outline: none;
}
.userName .verification {
  display: flex;
  border: none;
  outline: none;
}
.userName .verification input {
  outline: none;
  border: none;
  height: 100%;
  width: 60%;
}
.userName .verification img {
  height: 100%;
  width: 40%;
  height: 100%;
  margin: 0;
  border: none;
}
.phone_login {
  width: 100%;
  margin: 3vh 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border: 1px solid #e6e6e6;
  border-left: none;
}
.phone_login label {
  width: 100%;
  padding-left: 8%;
  height: 8vh;
  box-sizing: border-box;
}

.phone_login label input {
  width: 100%;
  height: 100%;
  border: none;
  font-size: 18px;
  border-bottom: 1px solid #e6e6e6;
  outline: none;
}
.phone_login .phoneCode {
  border-bottom: none;
}
.phone {
  display: flex;
}
.phone input {
  width: 60%;
  height: 100%;
}
.phone .getCode {
  font-size: 14px;
  width: 39%;
  height: 100%;
  border: none;
  outline: none;
  color: #9c9c9c;
  background-color: transparent;
  text-align: center;
  line-height: 100%;
}
.phoneRight {
  color: #e02e24 !important;
}
.loginButton {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.login_button {
  margin-bottom: 3vh;
  font-size: 16px;
  border: none;
  outline: none;
  color: #fff;
  width: 80%;
  height: 6vh;
  background-color: #e02e24;
  border-radius: 4px;
}
.back_button {
  width: 80%;
  height: 6vh;
  font-size: 16px;
  border: 1px solid #e02e24;
  outline: none;
  color: #e02e24;
  background-color: #fff;
  border-radius: 4px;
}
* label input:focus {
  outline: none;
}
</style>


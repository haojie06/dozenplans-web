<template>
  <el-form class="login_container" label-position="left" label-width="0px">
    <h3 class="login_title">用户登录</h3>
    <el-form-item>
      <el-input type="text" v-model="loginForm.email"
                auto-complete="off" placeholder="邮箱"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input type="password" v-model="loginForm.password"
                auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="primary" style="width: 100%;background: #66bb6a;border: none"
                 @click="login">登录
      </el-button>
    </el-form-item>
    <el-menu-item style="width: 50%">
      <el-button type="text" @click="toRegister">没有账号？点击注册</el-button>
    </el-menu-item>
  </el-form>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      responseResult: []
    }
  },
  methods: {
    login () {
      // todo 自己登录，获取token并存储
    },
    toRegister () {
      // todo 跳转到注册界面，让用户注册
    }
  }
}
</script>

<style>
.login_container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0 auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>

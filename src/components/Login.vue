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
      <el-checkbox v-model="remember">记住登录信息</el-checkbox>
      <el-button type="primary" style="width: 100%;background: #66bb6a;border: none"
                 @click="login">登录</el-button>
      <el-button type="text" style="width: 50%;color: blue;border: none"
                 @click="toRegister">没有账号？点击注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {parseUtils} from '../utils/utils'

export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        id: '',
        username: '',
        email: '',
        password: ''
      },
      responseResult: [],
      remember: false
    }
  },
  methods: {
    login () {
      // 取 this 保持仅仅是此刻的this
      let _this = this
      if (
        this.loginForm.email === '' ||
        this.loginForm.password === ''
      ) {
        this.$message.error('信息不完整，无法注册')
      } else {
        let data = this.$qs.stringify({
          'email': this.loginForm.email,
          'password': this.loginForm.password
        })
        let config = {
          method: 'post',
          url: '/login',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: data
        }

        this.$axios(config)
          .then(successResponse => {
            console.log(successResponse)
            if (successResponse.data.result.Code === 200) {
              console.log('resp', successResponse.data.result.Data)
              this.$notify({
                title: '登录成功',
                message: '即将跳转界面',
                duration: 5000
              })
              // todo to add username to loginForm
              // 存下 token 与 loginForm
              let token = successResponse.data.result.Data
              let user = parseUtils.parseToken(token)
              console.log('token', user)
              _this.loginForm.username = user.aud
              _this.loginForm.id = user.jti
              _this.$store.commit('setToken', token)
              _this.$store.commit('login', _this.loginForm)
              // 从哪里来登录就跳回哪里，否则就跳转到主界面
              let path = this.$route.query.redirect
              setTimeout(() => {
                this.$router.replace({path: path === '/' || path === undefined
                  ? '/index' : path})
              }, 1500)
            } else {
              this.$message.error('登录失败：' + successResponse.data.result)
            }
          })
          .catch(failResponse => {
            console.log('loginError', failResponse.data)
            this.$message.error('登录失败：' + failResponse)
          })
      }
    },
    toRegister () {
      this.$router.replace({ path: '/register' })
    }
  }
}
</script>

<style>
body {
  background: url(../assets/LoginBackgroundImg1.png);
  background-repeat: no-repeat;
  background-size: 100% auto;
}
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

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
                 @click="login">登录</el-button>
      <el-button type="text" style="width: 50%;text-color: deepskyblue;border: none"
                 @click="toRegister">没有账号？点击注册</el-button>
    </el-form-item>
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
              alert('登录成功，将跳转界面')
              _this.$store.commit('login', _this.loginForm)
              let path = this.$route.query.redirect
              // 从哪里来登录就跳回哪里，否则就跳转到主界面
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

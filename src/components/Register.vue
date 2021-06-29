<template>
  <el-form class="login_container" label-position="left" label-width="0px">
    <h3 class="login_title">用户注册</h3>
    <el-form-item>
      <el-input type="text" v-model="registerForm.username"
                auto-complete="off" placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input type="text" v-model="registerForm.email"
                auto-complete="off" placeholder="邮箱"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input type="password" v-model="registerForm.password"
                auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="primary" style="width: 100%;background: #66bb6a;border: none"
                 @click="register">注册
      </el-button>
    </el-form-item>
    <el-menu-item style="width: 50%">
      <el-button type="text" @click="toLogin">已有账号？点击登录</el-button>
    </el-menu-item>
  </el-form>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      registerForm: {
        username: '',
        email: '',
        password: ''
      },
      responseResult: []
    }
  },
  methods: {
    register () {
      if (
        this.registerForm.username === '' ||
        this.registerForm.email === '' ||
        this.registerForm.password === ''
      ) {
        this.$message.error('信息不完整，无法注册')
      } else {
        let data = this.$qs.stringify({
          'username': this.registerForm.username,
          'email': this.registerForm.email,
          'password': this.registerForm.password
        })
        let config = {
          method: 'post',
          url: '/users',
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
              alert('注册成功，将跳转到登录界面')
              setTimeout(() => {
                this.$router.replace({ path: '/login' })
              }, 1500)
            } else {
              this.$message.error('注册失败：' + successResponse.data.result)
            }
          })
          .catch(failResponse => {
            console.log('registerError', failResponse.data)
            this.$message.error('注册失败：' + failResponse)
          })
      }
    },
    toLogin () {
      // todo 跳转到登录界面，让用户登录
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

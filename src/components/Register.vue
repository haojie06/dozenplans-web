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
      <el-button type="text" @click="changeLogin">已有账号？点击登录</el-button>
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
      // todo 自己登录，所以只需要确定成功，然后跳转到登录界面
    },
    changeLogin () {
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

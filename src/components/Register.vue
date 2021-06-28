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
      <el-button type="primary" style="width: 100%;background: #505458;border: none"
                 @click="register">登录
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
      // todo
    },
    changeLogin () {
      // todo
    }
  }
}
</script>

<style scoped>

</style>

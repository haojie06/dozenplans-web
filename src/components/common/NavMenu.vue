<template>
  <div>
    <el-menu
      :default-active="$route.path"
      router
      mode="horizontal"
      background-color="white"
      text-color="#222"
      active-text-color="green"
      style="min-width: 1300px">
      <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">
        {{ item.navItem }}
      </el-menu-item>
      <a href="#nowhere" style="color: #222;float: right;padding: 20px">{{ username }}</a>
      <el-button style="float:right;font-size: 16px;color: #000000;
      margin-top: 8px" @click="dialogVisible = true">
        退出登录<i class="el-icon-remove-outline el-icon--right"></i>
      </el-button>
      <span style="position: absolute;padding-top: 20px;right: 43%;font-size: 20px;font-weight: bold">
      DozenPlans</span>
    </el-menu>
    <el-dialog
      title="确定登出"
      :visible.sync="dialogVisible"
      width="30%" append-to-body>
      <span>您确定要退出登录</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="logout">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'NavMenu',
  data () {
    return {
      navList: [
        {name: '/index', navItem: '任务列表'},
        {name: '/charts', navItem: '统计报表'}
      ],
      username: this.$store.state.user.username,
      dialogVisible: false
    }
  },
  methods: {
    logout () {
      this.$store.commit('logout')
      this.dialogVisible = false
      this.$router.replace({ path: '/login' })
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}

span {
  pointer-events: none;
}
</style>

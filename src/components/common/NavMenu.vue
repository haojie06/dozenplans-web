<template>
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
    <a href="#nowhere" style="color: #222;float: right;padding: 20px;">{{ username }}</a>
    <el-button style="float:right;font-size: 16px;color: greenyellow;padding-top: 18px" @click="logout">
      退出登录<i class="el-icon-remove-outline el-icon--right"></i>
    </el-button>
    <span style="position: absolute;padding-top: 20px;right: 43%;font-size: 20px;font-weight: bold">
      DozenPlans</span>
  </el-menu>
</template>
<script>
export default {
  name: 'NavMenu',
  data () {
    return {
      navList: [
        {name: '/index', navItem: '任务列表'},
        {name: '/chart', navItem: '统计报表'}
      ],
      username: this.$store.state.user.username
    }
  },
  methods: {
    logout () {
      // todo
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

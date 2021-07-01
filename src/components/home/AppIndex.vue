<template>
  <el-container>
    <el-aside style="width: 200px;margin-top: 20px">
      <switch></switch>
      <SideMenu @indexSelect="listByID" ref="sideMenu"></SideMenu>
    </el-aside>
    <el-main>
      <TaskList></TaskList>
    </el-main>
  </el-container>
</template>

<script>
import SideMenu from './SideMenu'
import TaskList from './TaskList'

export default {
  name: 'AppIndex',
  components: {SideMenu, TaskList},
  methods: {
    listByID () {
      // let _this = this
      // let cid = this.$refs.sideMenu.cid
    }
  }
}
</script>

<style scoped>

</style>

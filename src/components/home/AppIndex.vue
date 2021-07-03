<template>
  <el-container>
    <el-aside style="width: 200px;margin-top: 20px">
      <switch></switch>
      <SideMenu @indexSelect="listByID" ref="sideMenu"></SideMenu>
    </el-aside>
    <el-main>
      <TaskList v-bind:list="list" class="list-area" ref="listArea"></TaskList>
    </el-main>
  </el-container>
</template>

<script>
import SideMenu from './SideMenu'
import TaskList from './TaskList'

export default {
  name: 'AppIndex',
  components: {SideMenu, TaskList},
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.listByID('all')
  },
  methods: {
    listByID (type) {
      let _this = this
      let id = this.$refs.sideMenu.id
      if (type === undefined) {
        type = this.$refs.sideMenu.listType
      }
      let url
      if (type === 'tag') {
        url = '/tags/' + id
      } else if (type === 'cat') {
        url = '/categories/' + id
      } else if (type === 'all') {
        url = '/tasks?id=' + this.$store.state.user.id
      }
      let config = {
        method: 'get',
        url: url,
        headers: {
          'Authorization': this.$store.state.token
        }
      }
      this.$axios(config).then(resp => {
        if (resp.data.result.Code === 200) {
          // _this.$refs.listArea.taskList = resp.data.result.Data
          // _this.$store.commit('setShowList', resp.data.result.Data)
          _this.list = resp.data.result.Data
          console.log('listById', resp.data)
          console.log('curList', _this.$refs.listArea.taskList)
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>

</style>

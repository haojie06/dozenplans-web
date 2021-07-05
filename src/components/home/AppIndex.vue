<template>
  <el-container>
    <el-aside style="width: 200px;margin-top: 20px">
      <switch></switch>
      <SideMenu @indexSelect="listByID" @emitCate="getCate" @emitTag="getTag" ref="sideMenu"></SideMenu>
    </el-aside>
    <el-main>
      <el-button class="edit-button" type="info" icon="el-icon-edit" circle @click="newEdit"></el-button>
      <TaskList @refreshList="listByID" v-bind:list="list" :isLoading="isLoading"
                :category-list="categoryList" :tag-list="tagList" @editFinish="refresh"
                class="list-area" ref="listArea"></TaskList>
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
      list: [],
      isLoading: true,
      categoryList: [],
      tagList: []
    }
  },
  mounted () {
    this.listByID('all')
  },
  methods: {
    listByID (type) {
      this.isLoading = true
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
          _this.isLoading = false
        }
      }).catch(error => {
        console.log(error)
      })
    },
    newEdit () {
      // to create a dialog
    },
    refresh () {
      this.listByID()
      this.$refs.sideMenu.loadCategories()
      this.$refs.sideMenu.loadTags()
    },
    getCate (categories) {
      this.categoryList.slice(0, this.categoryList.length)
      // console.log('cate', categories)
      for (let categoriesKey of categories) {
        // console.log('cateTest', categoriesKey.CategoryName)
        this.categoryList.push(categoriesKey.CategoryName)
      }
      // console.log('cates:', this.categoryList)
    },
    getTag (tags) {
      this.tagList.slice(0, this.tagList.length)
      for (let tagsKey of tags) {
        this.tagList.push(tagsKey.TagName)
      }
      console.log('tags:', this.tagList)
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <el-menu
    default-active="1"
    class="el-menu-vertical"
    @open="handleOpen"
    @close="handleClose"
    active-text-color="#66bb6a">
    <el-menu-item index="1">
      <i class="el-icon-menu"></i>
      <span slot="title">所有任务</span>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-files"></i>
        <span>科目分类</span>
      </template>
      <el-menu-item v-for="(item,i) in categoryList" :key="i" :index="i + 1">
        {{ item.CategoryName }}
      </el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-collection-tag"></i>
        <span>标签分类</span>
      </template>
      <el-menu-item index="3-1">选项1</el-menu-item>
      <el-menu-item index="3-2">选项2</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'SideMenu',
  data () {
    return {
      tagList: [],
      categoryList: [
      ]
    }
  },
  mounted () {
    this.loadCategories()
    this.loadTags()
  },
  methods: {
    loadCategories () {
      let token = this.$store.state.token
      let categoryConfig = {
        method: 'get',
        url: '/categories',
        headers: {
          'Authorization': token
        }
      }
      this.$axios(categoryConfig).then(resp => {
        console.log('categoryConfig', resp)
        if (resp.status === 200 && resp.data.result.Code === 200) {
          // todo to add
          this.categoryList = resp.data.result.Data
          // let list = resp.data.result.Data
          // for (let l in list) {
          //   for (let category in this.categoryList) {
          //     if (category.Name !== l.CategoryName) {
          //     }
          //   }
          // }
        }
      }).catch(error => {
        console.log('categoryError', error)
      })
    },
    loadTags () {
      let token = this.$store.state.token
      let tagConfig = {
        method: 'get',
        url: '/tags',
        headers: {
          'Authorization': token
        }
      }
      this.$axios(tagConfig).then(resp => {
        console.log('tagConfig', resp)
        // todo to add new
        if (resp.status === 200 && resp.data.result.Code === 200) {
          this.tagList = resp.data.result.Data
        }
      }).catch(error => {
        console.log('tagError', error)
      })
    }
  }
}
</script>

<style scoped>

</style>

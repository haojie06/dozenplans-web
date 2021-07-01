<template>
  <el-menu
    default-active="1"
    class="el-menu-vertical"
    @select="handleSelect"
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
      <el-menu-item v-for="(item,i) in categoryList" :key="i" :index="item.Id + 3">
        {{ item.CategoryName}}
      </el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-collection-tag"></i>
        <span>标签分类</span>
      </template>
      <el-menu-item v-for="(item,i) in tagList" :key="i" :index="item.Id + 3 + categoryList.length">
        {{ item.TagName}}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'SideMenu',
  data () {
    return {
      tagList: [],
      categoryList: [],
      cid: ''
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
    },
    handleSelect (key, keyPath) {
      if (key === 2 && key === 3) {
        // 此时不应跳转
        this.cid = -1
        return
      } else if (key === 1) {
        // 当index为1时，我们选择all
        this.cid = 0
      } else if (key > 3 + this.categoryList.length) {
        // 此时以tag呈现list
        this.cid = key - 3 - this.categoryList.length
      } else {
        // 此时为category
        this.cid = key - 3
      }
      this.$emit('indexSelect')
    }
  }
}
</script>

<style scoped>

</style>

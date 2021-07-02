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
      <el-menu-item v-for="(item,i) in categoryList" :key="i" :index=getIndexFromCategory(item.Id)>
        {{ item.CategoryName}}
      </el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-collection-tag"></i>
        <span>标签分类</span>
      </template>
      <el-menu-item v-for="(item,i) in tagList" :key="i" :index=getIndexFromTag(item.Id)>
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
      id: '',
      listType: 'all'
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
    handleSelect (index, indexPath) {
      console.log('indexSelect:', index)
      if (index.substr(0, 3) === 'tag' ||
        index.substr(0, 3) === 'cat') {
        this.id = index.substr(3)
        this.listType = index.substr(0, 3)
      } else if (index === 1 || index === '1') {
        this.listType = 'all'
      } else {
        return
      }
      this.$emit('indexSelect')
    },
    getIndexFromTag (id) {
      return 'tag' + id.toString()
    },
    getIndexFromCategory (id) {
      return 'cat' + id.toString()
    }
  }
}
</script>

<style scoped>

</style>

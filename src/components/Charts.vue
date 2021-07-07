<template>
<!--  <div style="width: 600px; height: 600px" ref="CategoryChart"></div>-->
<!--  <div style="width: 600px; height: 600px" ref="TagChart"></div>-->
  <div style="margin-left:1%;margin-right:1%">
    <el-row style="margin-top: 20px">
      <el-col :span="6">
        <el-card style="margin-left: 5%;margin-right: 5%" :shadow="always">
          任务分布情况<br><br>饼状图<br><br>种类 与 标签
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="margin-left: 5%;margin-right: 5%" :shadow="always">
          <div style="width: 100%; height: 100%" ref="CategoryChart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="margin-left: 5%;margin-right: 5%" :shadow="always">
          <div style="width: 100%; height: 100%" ref="TagChart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Charts',
  data () {
    return {
      categoryChart: null,
      categoryList: [],
      tagChart: null,
      tagList: []
    }
  },
  mounted () {
    this.categoryChart = this.$echarts.init(this.$refs.CategoryChart)
    this.tagChart = this.$echarts.init(this.$refs.TagChart)
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
          this.categoryList = resp.data.result.Data
          this.setPieChart(this.getDataFromList('category'), 'category')
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
        if (resp.status === 200 && resp.data.result.Code === 200) {
          this.tagList = resp.data.result.Data
          this.setPieChart(this.getDataFromList('tag'), 'tag')
        }
      }).catch(error => {
        console.log('tagError', error)
      })
    },
    setPieChart (data, type) {
      let option = {
        xAxis: {type: 'category'},
        yAxis: {},
        title: {
          show: true,
          text: type === 'tag' ? '标签统计' : '种类统计'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/>{c} : {d}%',
          confine: true
        },
        series: [
          {
            type: 'pie',
            data: data,
            radius: '80%'
          }
        ]
      }
      if (type === 'category') {
        this.categoryChart.setOption(option)
      } else if (type === 'tag') {
        this.tagChart.setOption(option)
      }
    },
    getDataFromList (type) {
      let list = null
      let data = []
      if (type === 'category') {
        list = this.categoryList
      } else if (type === 'tag') {
        list = this.tagList
      } else {
        console.log('chartError', type)
      }
      for (let listElement of list) {
        data.push({name: type === 'category' ? listElement.CategoryName : listElement.TagName,
          value: listElement.TaskCount})
      }
      console.log('data', data)
      return data
    }
  }
}
</script>

<style scoped>

</style>

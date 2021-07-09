<template>
  <div style="margin-left:1%;margin-right:1%">
    <el-row style="margin-top: 20px">
      <el-col :span="6">
        <el-card style="margin-left: 5%;margin-right: 5%" shadow="always">
          任务分布情况<br><br>任务完成情况<br><br>任务热力日历图
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="margin-left: 5%;margin-right: 5%">
          <div style="width: 100%; height: 100%" ref="CategoryChart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="margin-left: 5%;margin-right: 5%">
          <div style="width: 100%; height: 100%" ref="TagChart"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 40px">
      <el-col :span="7">
        <el-card style="margin-left: 5%;margin-right: 5%">
          <div style="width: 100%; height: 240px" ref="FinishRadar"></div>
        </el-card>
      </el-col>
      <el-col :span="15">
        <el-card style="margin-left: 5%;margin-right: 5%">
          <div style="width: 100%; height: 240px" ref="TaskCalendar"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {parseUtils} from '../utils/utils'

export default {
  name: 'Charts',
  data () {
    return {
      categoryChart: null,
      categoryList: [],
      tagChart: null,
      finishRadar: null,
      taskCalendar: null,
      tagList: [],
      taskList: [],
      curDate: '',
      formerDate: '',
      progress: []
    }
  },
  mounted () {
    this.categoryChart = this.$echarts.init(this.$refs.CategoryChart)
    this.tagChart = this.$echarts.init(this.$refs.TagChart)
    this.finishRadar = this.$echarts.init(this.$refs.FinishRadar)
    this.taskCalendar = this.$echarts.init(this.$refs.TaskCalendar)
    this.loadCategories()
    this.loadTags()
    this.loadRadar()
    this.loadCalendar()
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
    loadRadar () {
      let _this = this
      let config = {
        method: 'get',
        url: '/tasks?id=' + this.$store.state.user.id,
        headers: {
          'Authorization': this.$store.state.token
        }
      }
      this.$axios(config).then(resp => {
        if (resp.data.result.Code === 200) {
          _this.taskList = resp.data.result.Data
          _this.setRadarChart()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    loadCalendar () {
      let token = this.$store.state.token
      let tagConfig = {
        method: 'get',
        url: '/progress',
        headers: {
          'Authorization': token
        }
      }
      this.$axios(tagConfig).then(resp => {
        if (resp.status === 200 && resp.data.result.Code === 200) {
          this.progress = resp.data.result.Data
          console.log('tagConfig', resp.data.result.Data)
          this.setCalendar()
        }
      }).catch(error => {
        console.log('tagError', error)
      })
    },
    setCalendar () {
      this.setDate()
      let option = {
        title: {
          top: 30,
          left: 'center',
          text: '最近一年的任务完成情况'
        },
        tooltip: {
          trigger: 'item',
          formatter: '任务完成情况<br>{c}',
          confine: true
        },
        visualMap: {
          min: 1,
          max: 11,
          type: 'piecewise',
          orient: 'horizontal',
          left: 'center',
          top: 65,
          inRange: {
            color: ['#c5e1a5', '#33691e']
          }
        },
        calendar: {
          top: 120,
          left: 30,
          right: 30,
          cellSize: ['auto', 13],
          range: [this.formerDate, this.curDate],
          itemStyle: {
            borderWidth: 0.5
          },
          yearLabel: {show: false},
          dayLabel: {
            show: true,
            nameMap: 'cn'
          },
          monthLabel: {
            show: true,
            nameMap: 'cn'
          }
        },
        series: {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: this.getVirtulData()
        }
      }
      this.taskCalendar.setOption(option)
    },
    setDate () {
      let date = new Date()
      this.curDate = this.$echarts.format.formatTime('yyyy-MM-dd', +date)
      let strYear = date.getFullYear() - 1
      let strDay = date.getDate()
      let strMonth = date.getMonth() + 1
      if (strMonth < 10) {
        strMonth = '0' + strMonth
      }
      if (strDay < 10) {
        strDay = '0' + strDay
      }
      this.formerDate = strYear + '-' + strMonth + '-' + strDay
      console.log('curDate:', this.curDate)
      console.log('formerDate:', this.formerDate)
    },
    getVirtulData () {
      let data = []
      let start = this.$echarts.number.parseDate(this.formerDate).getTime()
      let end = this.$echarts.number.parseDate(this.curDate).getTime()
      console.log('start:', this.formerDate)
      console.log('end', this.curDate)
      let dayTime = 3600 * 24 * 1000
      let offset = 3600 * 12 * 1000
      let count
      let _this = this
      for (let time = start; time <= end; time += dayTime) {
        count = 0
        for (let date of _this.progress) {
          let cur = (new Date(parseUtils.parseTime(date.Date))).getTime() - offset
          // console.log('rfc:', cur)
          // console.log('time:', time)
          if (cur === time) {
            count = date.SuccesCount
          }
        }
        data.push([_this.$echarts.format.formatTime('yyyy-MM-dd', time), count])
      }
      console.log('progressData:', data)
      return data
    },
    setRadarChart () {
      let priorityMax = [0, 0, 0, 0, 0]
      let priorityFinished = [0, 0, 0, 0, 0]
      for (let taskListElement of this.taskList) {
        priorityMax[taskListElement.Priority] = priorityMax[taskListElement.Priority] + 1
        if (taskListElement.Status === 'done' ||
          taskListElement.CompleteCount > 0 || taskListElement.Status === 'success') {
          priorityFinished[taskListElement.Priority] = priorityFinished[taskListElement.Priority] + 1
          priorityFinished[4] = priorityFinished[4] + 1
        }
      }
      priorityMax[4] = this.taskList.length
      let max = this.taskList.length / 2
      let option = {
        title: {
          text: '不同优先级任务完成情况'
        },
        legend: {
          data: ['任务总数', '完成数量'],
          show: true,
          orient: 'vertical',
          left: '1%',
          bottom: '40%'
        },
        tooltip: {
          trigger: 'item',
          confine: true
        },
        radar: {
          // shape: 'circle',
          indicator: [
            {name: '不重要', max: max},
            {name: '一般', max: max},
            {name: '重要', max: max},
            {name: '很重要', max: max},
            {name: '总计', max: this.taskList.length}
          ],
          center: ['60%', '60%'],
          radius: 60
        },
        series: [{
          name: '完成情况',
          type: 'radar',
          data: [
            {
              value: priorityMax,
              name: '任务总数'
            },
            {
              value: priorityFinished,
              name: '完成数量',
              areaStyle: {
                color: 'rgba(255, 228, 52, 0.6)'
              }
            }
          ]
        }]
      }
      this.finishRadar.setOption(option)
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
            radius: ['30%', '80%'],
            itemStyle: {
              borderRadius: 5,
              borderColor: '#fff',
              borderWidth: 2
            }
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
        data.push({
          name: type === 'category' ? listElement.CategoryName : listElement.TagName,
          value: listElement.TaskCount
        })
      }
      console.log('data', data)
      return data
    }
  }
}
</script>

<style scoped>

</style>

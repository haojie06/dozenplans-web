<template>
  <div style="margin-left:1%;margin-right:1%">
    <el-row>
      <el-col :span="4" v-for="(item, i) in taskList" :key=i :offset="1">
        <div style="margin-top:15px">
          <el-card :body-style="{ padding: '0px', color: getColorByPri(item.Priority)}" shadow="hover">
            <!--   to add content         -->
            <div>
              <span>{{ item.TaskName }}</span><br>
              <div class="other-info">
                <time class="time"><strong>结束时间:</strong>{{ getTextTime(item.DeadlineAt) }}</time>
                <el-popconfirm title="确定结束任务吗？">
                  <el-button type="text" class="button" @click="add(item)">结束</el-button>
                </el-popconfirm>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {parseUtils} from '../../utils/utils'

export default {
  name: 'TaskList',
  data () {
    return {
      taskList: [],
      colorPriority: ['#4caf50', '#1e88e5', '#f9a825', '#f44336']
    }
  },
  watch: {
    'this.$store.state.showList' () {
      console.log('storeList', this.$store.state.showList)
      this.taskList = this.$store.state.showList
    }
  },
  methods: {
    getColorByPri (priority) {
      return this.colorPriority[priority]
    },
    getTextTime (time) {
      return parseUtils.parseTime(time)
    },
    loadList () {
      let config = {
        method: 'get',
        url: '/tasks?id=' + this.$store.state.user.id,
        headers: {
          'Authorization': this.$store.state.token
        }
      }
      let _this = this
      this.$axios(config).then(resp => {
        console.log('listInit', resp.data)
        if (resp && resp.data.result.Code === 200) {
          _this.taskList = resp.data.result.Data
          _this.$store.commit('setShowList', resp.data.result.Data)
          console.log('taskList:', _this.taskList)
        }
      }).catch(error => {
        console.log(error)
      })
    }
  },
  mounted () {
    this.loadList()
  }

}
</script>

<style scoped>

</style>

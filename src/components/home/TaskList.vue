<template>
  <div style="margin-left:1%;margin-right:1%">
<!--    <el-skeleton :rows="6" animated :loading="isLoading"/>-->
    <el-row>
      <el-col :span="4" v-for="(item, i) in list" :key=i :offset="1">
        <div style="margin-top:15px">
          <el-card :body-style="{ padding: '0px', color: getColorByPri(item.Priority)}"
                   shadow="hover" @click.native="edit(item)">
            <!--   to add content         -->
            <div>
              <strong>{{ item.TaskName }}</strong><br>
              <div class="other-info">
                <time class="time"><span>结束时间:</span>{{ getTextTime(item.DeadlineAt) }}</time>
                <el-popconfirm title="确定结束任务？" @onConfirm="finish(item)">
                  <el-button slot="reference" type="text" class="button"
                             :disabled="item.Status === 'done' || item.Status === 'failed'">
                    {{ getStatus(item) }}
                  </el-button>
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
  props: ['list', 'isLoading'],
  data () {
    return {
      taskList: [],
      colorPriority: ['#4caf50', '#1e88e5', '#f9a825', '#f44336'],
    }
  },
  // watch: {
  //   'this.$store.state.showList' () {
  //     console.log('storeList', this.$store.state.showList)
  //     this.taskList = this.$store.state.showList
  //   }
  // },
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
    },
    finish (item) {
      if (item.Status === 'undone') {
        item.Status = 'done'
        // todo to change in post
      }
    },
    edit (item) {
      // todo
    },
    getStatus (item) {
      let buttonTip
      if (item.Status === 'done') {
        buttonTip = '已完成'
      } else if (item.Status === 'undone') {
        buttonTip = '结束'
      } else if (item.Status === 'failed') {
        buttonTip = '失败任务'
      }
      return buttonTip
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div style="margin-left:1%;margin-right:1%">
    <el-row>
      <el-col :span="4" v-for="(item) in taskList" :key="item.classId" :offset="1">
        <div style="margin-top:15px">
          <el-card :body-style="{ padding: '0px', color: getColorByPri(item.Priority)}" shadow="hover">
            <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                 class="image">
            <div>
              <span>{{ item.TaskName }}</span><br>
              <div class="bottom clearfix">
                <time class="time"><strong>结束时间:</strong>{{ item.Deadline }}</time>
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
export default {
  name: 'TaskList',
  data () {
    return {
      taskList: [],
      colorPriority: ['#4caf50', '#1e88e5', '#f9a825', '#f44336']
    }
  },
  methods: {
    getColorByPri (priority) {
      return this.colorPriority[priority]
    },
    loadList () {

    }
  },
  mounted () {
    this.loadList()
  }

}
</script>

<style scoped>

</style>

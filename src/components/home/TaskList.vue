<template>
  <div style="margin-left:1%;margin-right:1%">
    <!--    <el-skeleton :rows="6" animated :loading="isLoading"/>-->
    <el-row>
      <el-col :span="4" v-for="(item, i) in list" :key=i :offset="1">
        <div style="margin-top:15px">
          <el-card :body-style="{ padding: '0px', color: getColorByPri(item.Priority)}"
                   shadow="hover" @click.native="edit(item)">
            <span>{{ item.Content }}</span>
            <div>
              <strong>{{ item.TaskName }}</strong><br>
              <div class="other-info">
                <time class="time"><span>结束时间:</span>{{ getTextTime(item.DeadlineAt) }}</time>
                <el-popconfirm title="确定结束任务？" @confirm="finish(item)">
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
    <el-dialog title="编辑任务" :visible.sync="dialogFormVisible" append-to-body>
      <el-form :model="curItem" label-width="100px" size="small" label-position="right">
        <el-form-item label="任务名称" label-width="120px">
          <el-input v-model="curItem.TaskName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="任务内容">
          <el-input type="textarea" v-model="curItem.Content"></el-input>
        </el-form-item>
        <el-form-item label="任务分类" label-width="120px">
          <el-select v-model="curItem.Category" placeholder="请选择分类" filterable allow-create default-first-option>
            <el-option v-for="(category, i) in categoryList" :key="i"
                       :label="category" :value="category"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务标签" label-width="120px">
          <el-select v-model="tagsForm" placeholder="请选择标签" filterable allow-create multiple default-first-option>
            <el-option v-for="(tag, i) in tagList" :key="i"
                       :label="tag" :value="tag"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" label-width="120px">
          <el-radio-group v-model="curItem.Priority" fill="#4caf50">
            <el-radio :label="0">不重要</el-radio>
            <el-radio :label="1">一般</el-radio>
            <el-radio :label="2">重要</el-radio>
            <el-radio :label="3">很重要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="结束时间" label-width="120px">
          <el-date-picker
            v-model="curItem.DeadlineAt"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否为周期任务" label-width="120px">
          <el-switch
            v-model="curItem.IsCycle"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {parseUtils} from '../../utils/utils'

export default {
  name: 'TaskList',
  props: ['list', 'isLoading', 'categoryList', 'tagList'],
  data () {
    return {
      taskList: [],
      colorPriority: ['#4caf50', '#1e88e5', '#f9a825', '#f44336'],
      curItem: {
        'Id': 0,
        'UserId': 0,
        'TaskName': '',
        'Content': '',
        'Priority': 0,
        'CreatedAt': '',
        'UpdatedAt': '',
        'FinishedAt': '',
        'DeadlineAt': '',
        'Status': 'done',
        'IsCycle': false,
        'CompleteCount': 0,
        'NotifyMode': 'none',
        'NotifyTime': '2021-07-01T10:12:12-04:00',
        'Notified': false,
        'MailSend': false,
        'NotifyInterval': 50,
        'Tags': '',
        'Category': ''
      },
      tagsForm: [],
      dialogFormVisible: false
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
        item.FinishedAt = parseUtils.getCurRFC()
        let config = {
          method: 'put',
          url: '/tasks/' + item.Id,
          headers: {
            'Authorization': this.$store.state.token
          },
          data: JSON.stringify(item)
        }
        let _this = this
        this.$axios(config).then(resp => {
          console.log('listInit', resp.data)
          if (resp && resp.data.result.Code === 200) {
            if (item.Status === resp.data.result.Data.Status) {
              _this.$emit('refreshList')
            } else {
              _this.$notify({
                title: '错误',
                message: '修改完成情况失败',
                type: 'warning'
              })
            }
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    // about edit
    edit (item) {
      if (item !== null) {
        this.curItem = item
        this.tagsForm = parseUtils.splitTags(this.curItem.Tags)
        console.log('splitResult', this.tagsForm)
      }
      console.log('curItem:', this.curItem)
      this.dialogFormVisible = true
      // after edit:this.$emit('indexSelect')
    },
    confirmEdit () {
      // todo
      this.dialogFormVisible = false
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

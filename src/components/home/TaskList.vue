<template>
  <div style="margin-left:1%;margin-right:1%">
    <!--    <el-skeleton :rows="6" animated :loading="isLoading"/>-->
    <el-row>
      <el-col :span="4" v-for="(item, i) in list" :key=i :offset="1">
        <div style="margin-top:15px">
          <el-card :body-style="{ padding: '5px',borderwidth:'5px',backgroundColor:'white'} "
                   shadow="always" :style="{shadowColor:getColorByPri(item.Priority)}" @click.native="edit(item)">
            <span style='display:block; overflow-y: scroll; overflow-x: auto; height: 120px;'>{{ item.Content }}</span>
            <el-divider class="_main_divider"></el-divider>
            <div>
              <strong style="display: block" :style="{color: getColorByPri(item.Priority)}">{{ item.TaskName }}</strong>
              <el-divider class="_main_divider"></el-divider>
              <div class="other-info">
                <time class="time"><span>结束时间:</span>{{ getTextTime(item.DeadlineAt) }}</time>
                <el-popconfirm title="确定结束任务？" @confirm="finish(item)">
                  <el-button slot="reference" type="text" class="button" @click.stop=""
                             :disabled="item.Status === 'done' || item.Status === 'failed' || item.Status === 'success'">
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
        <el-form-item label="任务内容" label-width="120px">
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
          <span style="margin-left: 20px;margin-right: 10px">提醒模式</span>
          <el-radio-group v-model="curItem.NotifyMode" fill="#4caf50">
            <el-radio label="none">不提醒</el-radio>
            <el-radio label="timing">定时提醒</el-radio>
            <el-radio label="interval">间隔提醒</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--        开始不能大于结束的时间-->
        <el-form-item label="提醒开始时间" label-width="120px">
          <el-date-picker
            v-model="curItem.NotifyTime"
            type="datetime"
            :disabled="isNotify(curItem.NotifyMode)"
            placeholder="选择日期时间"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="提醒时间间隔" label-width="120px">
          <template>
            <el-input-number v-model="time.day" :disabled="curItem.NotifyMode !=='interval'"
                             :precision="0" :step="1" :min="0" :max="60"></el-input-number>
            <span style="margin-left: 5px;margin-right: 10px">日</span>
            <el-input-number v-model="time.hour" :disabled="curItem.NotifyMode !=='interval'"
                             :precision="0" :step="1" :min="0" :max="24"></el-input-number>
            <span style="margin-left: 5px;margin-right: 10px">时</span>
            <el-input-number v-model="time.min" :disabled="curItem.NotifyMode !=='interval'"
                             :precision="0" :step="1" :min="1" :max="60"></el-input-number>
            <span style="margin-left: 5px">分</span>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
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
        'TaskName': '',
        'Content': '',
        'Priority': 0,
        'DeadlineAt': '',
        'Status': 'undone',
        'IsCycle': false,
        'NotifyMode': 'none',
        'NotifyTime': '2021-07-01T10:12:12-04:00',
        'NotifyInterval': 0,
        'Tags': '',
        'Category': ''
      },
      defaultItem: {
        'TaskName': '',
        'Content': '',
        'Priority': 0,
        'DeadlineAt': '',
        'Status': 'undone',
        'IsCycle': false,
        'NotifyMode': 'none',
        'NotifyTime': '2021-07-01T10:12:12-04:00',
        'NotifyInterval': 0,
        'Tags': '',
        'Category': ''
      },
      tagsForm: [],
      time: {
        hour: 0,
        min: 0,
        day: 0
      },
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
        item.Status = 'success'
        item.FinishedAt = parseUtils.getRFCTime(new Date())
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
            console.log(resp.data)
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
      // 仅仅copy给curItem，这样方便以后清空表格
      if (item !== null && item !== undefined) {
        console.log('editMode:', 'oldEdit')
        Object.assign(this.curItem, item)
      } else {
        console.log('editMode:', 'newEdit')
        for (let itemKey in item) {
          delete item[itemKey]
        }
        Object.assign(this.curItem, this.defaultItem)
      }
      this.tagsForm = parseUtils.splitTags(this.curItem.Tags)
      console.log('splitResult', this.tagsForm)
      parseUtils.setIntervalTime(this.curItem.NotifyInterval, this.time)
      console.log('curItem:', this.curItem)
      this.dialogFormVisible = true
    },
    checkItem () {
      let item = this.curItem
      let tip = ''
      let deadLine = (typeof item.DeadlineAt) === 'string'
        ? parseUtils.parseTime(item.DeadlineAt) : item.DeadlineAt
      if (item.TaskName === '') {
        tip = '任务名不可为空'
      } else if (item.Content === '') {
        tip = '任务内容不可为空'
      } else if (deadLine <= new Date()) {
        tip = '任务的截止时期不能早于现在'
      }
      if (tip !== '') {
        this.$notify({
          title: '提交形式错误',
          message: tip,
          type: 'warning'
        })
        return false
      }
      return true
    },
    confirmEdit () {
      // transform tags and intervalTime
      if (!this.checkItem()) {
        return
      }
      this.curItem.NotifyInterval = parseUtils.getIntervalSecond(this.time)
      this.curItem.Tags = parseUtils.mergeTags(this.tagsForm)
      console.log('timeType:', typeof this.curItem.DeadlineAt)
      if ((typeof this.curItem.DeadlineAt) !== 'string') {
        this.curItem.DeadlineAt = parseUtils.getRFCTime(this.curItem.DeadlineAt)
      }
      console.log('itemAfterEdit', this.curItem)
      console.log('Deadline:', this.curItem.DeadlineAt)
      let method = ''
      let url
      if (this.curItem.Id === null || this.curItem.Id === undefined) {
        method = 'post'
        url = '/tasks'
      } else {
        method = 'put'
        url = '/tasks/' + this.curItem.Id
      }
      let config = {
        method: method,
        url: url,
        headers: {
          'Authorization': this.$store.state.token,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(this.curItem)
      }
      let _this = this
      this.$axios(config).then(resp => {
        console.log('editResult', resp.data)
        if (resp && resp.data.result.Code === 200) {
          _this.$notify({
            title: '成功',
            message: '提交成功',
            type: 'success'
          })
          _this.$emit('editFinish')
        }
      }).catch(error => {
        console.log(error)
        _this.$notify({
          title: '失败',
          message: '提交失败',
          type: 'warning'
        })
      })
      this.dialogFormVisible = false
    },
    cancelEdit () {
      // todo
      this.dialogFormVisible = false
    },
    getStatus (item) {
      let buttonTip
      if (item.Status === 'done' || item.Status === 'success') {
        buttonTip = '已完成'
      } else if (item.Status === 'undone') {
        buttonTip = '结束'
      } else if (item.Status === 'failed') {
        buttonTip = '失败任务'
      }
      return buttonTip
    },
    isNotify (mode) {
      return !(mode === 'interval' || mode === 'timing')
    }
  }
}
</script>

<style>
body {
  background: #d6fae8;

}

._main_divider {
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #54d169;

}

::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}

</style>

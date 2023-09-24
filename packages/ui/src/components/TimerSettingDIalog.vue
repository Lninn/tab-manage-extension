<script setup>
import { ref, reactive } from 'vue'

const secondOpts = [
  5,
  10,
  20,
  45 * 60,
  120 * 60
]

const visible = ref(false)
const form = reactive({
  type: '1',
  date1: 5,
  date2: '',
})
</script>

<template>
  <el-button text @click="visible = true">
    click to open the Dialog
  </el-button>

  <el-dialog
    v-model="visible"
    title="时间设置"
    width="500"
  >
    <el-form :model="form">
      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-radio label="1">按选项</el-radio>
          <el-radio label="2">按时间</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="时间值" v-if="form.type === '1'">
        <el-select v-model="form.date1">
          <el-option v-for="item in secondOpts" :key="item" :label="item + '秒'" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间值" v-if="form.type === '2'">
        <el-time-picker v-model="form.date2" />
      </el-form-item>
      <el-form-item label="状态">
        <div>
          <div class="item">
            <span class="item-label">截止时间</span>
            <span>22:30</span>
          </div>
          <div class="item">
            <span class="item-label">分钟数</span>
            <span>200 分钟</span>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="visible = false">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.item {
  display: flex;
  gap: 8px;
}

.item-label {
  width: 60px;
  font-weight: 500;
}
</style>

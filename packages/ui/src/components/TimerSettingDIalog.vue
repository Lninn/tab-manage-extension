<script setup>
import { ref, reactive, computed } from 'vue'
import MaterialSymbolsEditRounded from './MaterialSymbolsEditRounded.vue'

const emit = defineEmits(['update'])

const minuteOpts = [
  10,
  30,
  45,
  60,
  120,
]

const visible = ref(false)
const form = reactive({
  type: '1',
  minuteOpt: undefined,
  currentTime: undefined,
})

function onConfirm() {
  visible.value = false

  let opt
  if (form.type === '1') {
    opt = form.minuteOpt
  } else {
    const now = new Date()
    opt = getMintesBetween2Date(form.currentTime, now)
  }

  emit('update', opt)
}

function getMintesBetween2Date(startDate, endDate) {

  const startMins = startDate.getTime()
  const endMins = endDate.getTime()

  const diffSeconds = startMins - endMins
  const mins = Math.round(diffSeconds / 60000);

  return mins
}

const info = computed(() => {
  const { minuteOpt, currentTime } = form
  if (form.type === '1') {
    const d = new Date()
    d.setMinutes(minuteOpt)

    return {
      opt: minuteOpt,
      time: d.toLocaleTimeString(),
    }
  } else {
    if (!currentTime) {
      return { opt: '--', time: '--' }
    }

    const now = new Date()
    const opt = getMintesBetween2Date(currentTime, now)
    const time = currentTime.toLocaleTimeString()

    return { opt, time }
  }
})

const makeRange = (start, end) => {
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}

const disabledHours = () => {
  const h = (new Date()).getHours()
  return makeRange(0, h - 1)
}
</script>

<template>
  <MaterialSymbolsEditRounded @click="visible = true" />

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
        <el-select v-model="form.minuteOpt">
          <el-option
            v-for="item in minuteOpts"
            :key="item"
            :label="item + '分钟'"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间值" v-if="form.type === '2'">
        <el-time-picker
          v-model="form.currentTime"
          :disabled-hours="disabledHours"
        />
      </el-form-item>
      <el-form-item label="状态">
        <div>
          <div class="item">
            <span class="item-label">截止时间</span>
            <span>{{ info.time }}</span>
          </div>
          <div class="item">
            <span class="item-label">分钟数</span>
            <span>{{ info.opt }} 分钟</span>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="onConfirm">
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

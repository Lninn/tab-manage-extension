<script setup>
import { onMounted, ref, computed } from 'vue';

import ResultList from './components/ResultList.vue'
import TimerSettingDIalog from './components/TimerSettingDIalog.vue'
import { closePage } from './shared'
import usePage from './composables/use-page'


const statusMap = {
  unStart: '启动定时',
  runnning: '运行中(点击取消)'
}

const { pages, refreshData } = usePage()

const selectedPage = ref()
const status = ref('unStart')
const timerId = ref()
const seconds = ref(0)

const numberOfMinutes = ref(30)
const totalSends = computed(() => numberOfMinutes.value * 60)


function sleepMac() {
  fetch('http://localhost:3000/sleepMac')
    .then(res => res.json())
    .then(res => {
      console.log('debhug ', res)
    })
}

function onChange(pageInfo) {
  if (selectedPage.value) {
    if (selectedPage.value.id === pageInfo.id) {
      selectedPage.value = undefined
      return
    }
  }
  selectedPage.value = pageInfo
}

async function handleClosePage() {
  const item = selectedPage.value
  if (item) {
    await closePage(item.id)
    selectedPage.value = undefined

    await refreshData()
  }
}

async function end() {
  cancalTimer()

  if (selectedPage.value) {
    await closePage(selectedPage.value.id)
    await refreshData()
    sleepMac()
  }
}

function cancalTimer() {
  status.value = 'unStart'
  clearInterval(timerId.value)
  timerId.value = undefined
  seconds.value = 0
}

async function postJSON(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

function saveData() {
  postJSON(
    'http://localhost:3000/pageData',
    pages.value
  )
}

function start() {

  if (status.value === 'unStart') {
    if (!selectedPage.value) {
      console.log('请选择一个页面')
      return
    }

    status.value = 'runnning'
  } else if (status.value === 'runnning') {
    // 取消
    cancalTimer()
    return
  }

  timerId.value = setInterval(() => {
    seconds.value++

    if (seconds.value === totalSends.value) {
      end()
    }
  }, 1000)
}

function onTimeOptChange(value) {
  numberOfMinutes.value = value
}
</script>

<template>
  <div class="title">页面管理</div>

  <div class="actions">
    <button :disabled="!selectedPage" @click="start">{{ statusMap[status] }}</button>
    <div class="seconds">倒计时：{{ totalSends - seconds }} 秒（{{ numberOfMinutes }} 分钟）</div>
    <TimerSettingDIalog @update="onTimeOptChange" />
    <button :disabled="!selectedPage" @click="handleClosePage">关闭页面</button>
    <button @click="saveData">Save Data</button>
  </div>

  <ResultList :pages="pages" :selectedPage="selectedPage" @onChange="onChange" />
</template>

<style>
.title {
  font-size: 24px;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.seconds {
  margin-right: 8px;
}

svg[disabled='true'] {
  color: #666;
  cursor: not-allowed;
  pointer-events: none;
}
</style>

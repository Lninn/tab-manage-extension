<script setup>
import { onMounted, ref } from 'vue';

import MaterialSymbolsEditRounded from './components/MaterialSymbolsEditRounded.vue'
import ResultList from './components/ResultList.vue'
import Modal from './components/Modal.vue'

import { closePage, dispatch, getPages } from './shared'


const statusMap = {
  unStart: '启动定时',
  runnning: '运行中(点击取消)'
}

const pages = ref([])
const selectedPage = ref()
const status = ref('unStart')
const timerId = ref()
const totalSends = ref(5)
const seconds = ref(0)
const showModal = ref(false)
const formValue = ref()

const secondOpts = [
  5,
  10,
  20,
  45 * 60,
  120 * 60
]

async function refreshData() {
  const data = await getPages()
  pages.value = data
}

onMounted(() => {
  refreshData()

  dispatch(() => {
    refreshData()
  })

  if (import.meta.env.DEV) {
    fetch('http://localhost:3000/pageData')
    .then(res => res.json())
    .then(res => {
      pages.value = res.data
    })
  }
})

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

    refreshData()
  }
}

function onClose() {
  showModal.value = false

  const newVal = formValue.value
  if (newVal) {
    totalSends.value = newVal
  }
}

async function end() {
  cancalTimer()

  if (selectedPage.value) {
    await closePage(selectedPage.value.id)
    refreshData()
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

</script>

<template>
  <div class="title">页面管理</div>

  <div class="actions">
    <button :disabled="!selectedPage" @click="start">{{ statusMap[status] }}</button>
    <div class="seconds">倒计时：{{ totalSends - seconds }}</div>
    <MaterialSymbolsEditRounded
      :style="{ 'font-size': 16, cursor: 'pointer' }"
      @click="showModal = true"
      :disabled="status==='runnning'"
    />
    <button :disabled="!selectedPage" @click="handleClosePage">关闭页面</button>
    <button @click="saveData">Save Data</button>
  </div>

  <ResultList :pages="pages" :selectedPage="selectedPage" @onChange="onChange" />

  <Teleport to="body">
    <!-- 使用这个 modal 组件，传入 prop -->
    <modal
      :show="showModal"
      @close="onClose"
    >
      <template #header>
        <h3>Second List Option</h3>
      </template>
      <template #body>
        <select v-model="formValue">
          <option v-for="item in secondOpts" :value="item">
            {{ item }} 秒
          </option>
        </select>
      </template>
    </modal>
  </Teleport>
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

<script setup>
import { ref, computed } from 'vue';
import ResultList from './components/ResultList.vue'
import TimerSettingDIalog from './components/TimerSettingDIalog.vue'
import { closePage } from './shared'
import usePage from './composables/use-page'
import useTimer, { statusMap } from './composables/use-timer'


const selectedPage = ref(null)

const numberOfMinutes = ref(30)
const totalSends = computed(() => {
  if (numberOfMinutes.value === 1) {
    return 5
  } else {
    return numberOfMinutes.value * 60
  }
})

const { pages, refreshData } = usePage()
const { start, status, seconds } = useTimer({ selectedPage, totalSends, refreshData })

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

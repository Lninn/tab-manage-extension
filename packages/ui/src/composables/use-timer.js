import { ref } from 'vue'
import { closePage } from '../shared'


const STATUS_OF_STABLE = 1
const STATUS_OF_RUNNING =2

const isRunning = s => s === STATUS_OF_RUNNING

export default function useTimer(props) {
  const { selectedPage, totalSends, refreshData, sleep = false } = props

  const status = ref(STATUS_OF_STABLE)
  const timerId = ref()

  const seconds = ref(0)

  async function end() {
    cancalTimer()
  
    if (selectedPage.value) {
      await closePage(selectedPage.value.id)
      await refreshData()

      selectedPage.value = null
      
      if (sleep) {
        sleepMac()
      }
    }
  }
  
  function cancalTimer() {
    status.value = STATUS_OF_STABLE
    clearInterval(timerId.value)
    timerId.value = undefined
    seconds.value = 0
  }

  function setup() {
    seconds.value++

    if (seconds.value === totalSends.value) {
      end()
    }
  }

  function start() {
    if (isRunning(status.value)) {
      cancalTimer()
    } else {
      if (!selectedPage.value) {
        console.log('请选择一个页面')
        return
      }

      status.value = STATUS_OF_RUNNING
      timerId.value = setInterval(setup, 1000)
    }
  }

  return {
    status,
    seconds,
    start,
  }
}

export const statusMap = {
  [STATUS_OF_STABLE]: '启动定时',
  [STATUS_OF_RUNNING]: '运行中(点击取消)'
}

function sleepMac() {
  fetch('http://localhost:3000/sleepMac')
    .then(res => res.json())
    .then(res => {
      console.log('debhug ', res)
    })
}

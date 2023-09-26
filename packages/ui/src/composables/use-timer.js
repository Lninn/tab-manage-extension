import { ref } from 'vue'


const STATUS_OF_STABLE = 1
const STATUS_OF_RUNNING =2

const isRunning = s => s === STATUS_OF_RUNNING

export default function useTimer(props) {
  const { selectedPage } = props

  const status = ref(STATUS_OF_STABLE)
  const timerId = ref(null)

  const currentSecond = ref(0)
  const numberOfMinutes = ref(30)
  const totalSends = computed(() => numberOfMinutes.value * 60)

  function cancel() {
    timerId.value = null
    status.value = STATUS_OF_STABLE
  }

  function start() {
    if (isRunning(status)) {
      cancel()
    } else {
      const id = setInterval(setup, 1000)
      timerId.value = id
      status.value = STATUS_OF_RUNNING
    }
  }

  function setup() {
    currentSecond.value++
  
    if (currentSecond.value === totalSends.value) {
      cancel()
    }
  }

  return { start }
}

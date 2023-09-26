import { register, getPages } from '../shared'
import { onMounted, ref } from 'vue'

export default function usePage() {
  const pages = ref([])

  const refreshData = async () => {
    if (import.meta.env.DEV) {
      const res = await fetch('http://localhost:3000/pageData')
      const data = await res.json()
      return data.data
    } else {
      const data = await getPages()
      return data
    }
  }

  async function init() {
    const data = await refreshData()
    pages.value = data
  }

  onMounted(async () => {
    register(() => {
      refreshData()
    })
  
    await init()
  })

  return { pages, refreshData }
}

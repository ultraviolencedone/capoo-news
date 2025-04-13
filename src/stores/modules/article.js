import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useArtStore = defineStore(
  'article',
  () => {
    // 分类列表
    const channelList = ref([])
    const setChannelList = newValue => {
      channelList.value = newValue
    }
    return { channelList, setChannelList }
  },
  {
    // 持久化
    persist: true
  }
)

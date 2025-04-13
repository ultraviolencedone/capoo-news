import { userGetinfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // token
    const token = ref('')
    const setToken = newValue => {
      token.value = newValue
    }
    // const removeToken = ()=>{
    //   token.value = ''
    // }

    // 用户基本信息
    const user = ref({})
    const getUser = async () => {
      const res = await userGetinfoService()
      user.value = res.data.data
    }
    const setUser = newValue => {
      user.value = newValue
    }
    return { token, setToken, user, getUser, setUser }
  },
  {
    // 持久化
    persist: true
  }
)

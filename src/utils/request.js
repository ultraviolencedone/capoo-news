// 创建axios实例
import axios from 'axios'
import { useUserStore } from '@/stores/modules/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  baseURL,
  timeout: 1000
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 请求前是否有token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  function (err) {
    return Promise.reject(err)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (res) {
    // 没啥问题
    if (res.data.code === 0) {
      return res
    }
    // 常规错误
    ElMessage({ message: res.data.message || '服务异常', type: 'error' })
    return Promise.reject(res.data)
  },
  function (err) {
    // 响应错误
    ElMessage({
      message: err.response.data.message || '服务异常',
      type: 'error'
    })
    // 如果401或者token过期
    if (err.response?.status === 401) {
      const router = useRouter()
      router.push('/login')
    }
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }

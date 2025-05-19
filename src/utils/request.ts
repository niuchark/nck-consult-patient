import axios, { AxiosError, type Method } from 'axios'
import { useUserStore } from '@/stores'
import { showToast } from 'vant'
import router from '@/router'

export const baseURL = 'https://consult-api.itheima.net/'

const instance = axios.create({
  // 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 2. 携带token
    const store = useUserStore()
    if (store.user?.token && config.headers) {
      // ts提示config.headers可能是undefined，所以需要加个判断
      config.headers.Authorization = `Bearer ${store.user.token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 3. 处理业务失败
    if (res.data.code !== 10000) {
      // 错误提示
      showToast(res.data.message || '业务失败')
      // 返回错误的promise
      return Promise.reject(res.data)
      // 传入code 将来catch的时候可以直接拿到使用
    }
    // 4. 摘取核心响应数据
    return res.data
  },
  (err: AxiosError) => {
    // 5. 处理401错误
    if (err.response?.status === 401) {
      // 清除本地用户信息
      const store = useUserStore()
      store.delUser()
      // 跳转到登陆页面，网址栏还要携带当前页面的地址（包含各个参数）
      router.push({
        path: '/login',
        query: { returnUrl: router.currentRoute.value.fullPath }
      })
      return Promise.reject(err)
    }
  }
)

export default instance

type Data<T> = {
  code: number
  message: string
  data: T
}

export const request = <T>(
  url: string,
  method: Method = 'GET', // Method类型是axios提供的一种类型，只支持get、post、put、delete等字符串；= 'GET'即给默认值
  submitData?: object
) => {
  // 参数：地址，请求方式，提交的数据
  // 返回：promise
  return instance.request<unknown, Data<T>>({
    url,
    method,
    [method.toUpperCase() === 'GET' ? 'params' : 'data']: submitData // 动态参数
  })
}

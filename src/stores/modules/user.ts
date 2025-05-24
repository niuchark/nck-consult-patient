import { ref } from 'vue'
import type { User } from '@/types/user'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'cp-user',
  () => {
    // 1.  用户信息状态
    const user = ref<User>()
    // 2. 设置用户信息的函数
    const setUser = (u: User) => {
      user.value = u
    }
    // 3. 删除用户信息的函数
    const delUser = () => {
      user.value = undefined
    }

    // 4. 设置QQ登陆成功后回调地址（不是跳转QQ登陆，而是成功后调回登陆前被拦截的页面）
    const returnUrl = ref<string>()
    const setReturnUrl = (url: string) => {
      returnUrl.value = url
    }
    return {
      user,
      setUser,
      delUser,
      setReturnUrl,
      returnUrl
    }
  },
  {
    persist: true
  }
)

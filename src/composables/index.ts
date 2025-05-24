import { ref, onMounted, type Ref } from 'vue'
import { cancelOrder, followOrUnfollow, deleteOrder } from '@/services/consult'
import type { ConsultOrderItem, FollowType } from '@/types/consult'
import { getPrescriptionPic } from '@/services/consult'
import {
  showFailToast,
  showImagePreview,
  showSuccessToast,
  showToast,
  type FormInstance
} from 'vant'
import { OrderType } from '@/enums'
import type { OrderDetail } from '@/types/order'
import { getMedicalOrderDetail } from '@/services/order'
import { sendMobileCode } from '@/services/user'
import type { CodeType } from '@/types/user'

// 封装逻辑，规范 useXxx，表示使用某功能
export const useFollow = (type: FollowType = 'doc') => {
  const loading = ref(false)
  // {a, b} 类型，传值得时候 {a, b, c} 也可以，这是类型兼容：多的可以给少的
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    try {
      await followOrUnfollow(item.id, type)
      item.likeFlag = item.likeFlag === 1 ? 0 : 1
    } finally {
      loading.value = false
    }
  }
  return { loading, follow }
}

// 封装查看处方逻辑
export const useShowPrescription = () => {
  const onShowPrescription = async (id?: string) => {
    if (id) {
      const res = await getPrescriptionPic(id)
      showImagePreview([res.data.url])
    }
  }
  return { onShowPrescription }
}

// 封装取消订单的逻辑
export const useCancelOrder = () => {
  const loading = ref(false)
  const cancelConsultOrder = async (item: ConsultOrderItem) => {
    try {
      loading.value = true
      await cancelOrder(item.id)
      item.status = OrderType.ConsultCancel
      item.statusValue = '已取消'
      showSuccessToast('取消成功')
    } catch (error) {
      showFailToast('取消失败' + error)
    } finally {
      loading.value = false
    }
  }
  return { loading, cancelConsultOrder }
}

// 删除订单逻辑
export const useDeleteOrder = (cb: () => void) => {
  const loading = ref(false)
  const deleteConsultOrder = async (item: ConsultOrderItem) => {
    try {
      loading.value = true
      await deleteOrder(item.id)
      showSuccessToast('删除成功')
      if (cb) {
        cb()
      }
    } catch (error) {
      showFailToast('删除失败' + error)
    } finally {
      loading.value = false
    }
  }
  return { loading, deleteConsultOrder }
}

// 获取药品订单详情逻辑
export const useOrderDetail = (id: string) => {
  const loading = ref(false)
  const order = ref<OrderDetail>()
  onMounted(async () => {
    loading.value = true
    try {
      const res = await getMedicalOrderDetail(id)
      order.value = res.data
    } finally {
      loading.value = false
    }
  })
  return { order, loading }
}

// 发送短信验证码
export const useSendCode = (mobile: Ref<string>, type: CodeType = 'login') => {
  const form = ref<FormInstance>()
  const time = ref(0) // 倒计时
  let timer: number // 定义一个定时器ID，用于清理定时器
  const onSend = async () => {
    // 验证：倒计时 手机号
    if (time.value) return
    await form.value?.validate('mobile')
    await sendMobileCode(mobile.value, type)
    showToast('发送成功')
    time.value = 60
    // 开启倒计时
    if (timer) clearInterval(timer) // 保险起见在启动计时器清除已有的计时器
    timer = setInterval(() => {
      time.value--
      if (time.value <= 0) clearInterval(timer)
    }, 1000)
  }
  // 在倒计时结束前组件如果销毁，计时器也要销毁
  onMounted(() => {
    clearInterval(timer)
  })

  return { time, onSend, form }
}

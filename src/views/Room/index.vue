<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomMessage from './components/RoomMessage.vue'
import RoomAction from './components/RoomAction.vue'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { MsgType, OrderType } from '@/enums'
import type { Message, TimeMessages } from '@/types/room'
import { onMounted, onUnmounted, ref, nextTick, provide } from 'vue'
import { baseURL } from '@/utils/request'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { getConsultOrderDetail } from '@/services/consult'
import dayjs from 'dayjs'
import { showToast } from 'vant'

const store = useUserStore()
const route = useRoute()

let socket: Socket
onUnmounted(() => {
  socket.close()
})

// 消息列表储存每一个消息
const list = ref<Message[]>([])
// 储存该问诊室订单详情信息
const consult = ref<ConsultOrderItem>()

// 提供问诊订单数据给后代组件
provide('consult', consult)

// 完成评价后修改评价组件为已完成
const completeEva = (score: number) => {
  const item = list.value.find((item) => item.msgType === MsgType.CardEvaForm)
  if (item) {
    item.msg.evaluateDoc = { score }
    item.msgType = MsgType.CardEva
  }
}
provide('completeEva', completeEva)

onMounted(async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
  // 建立链接，创建 socket.io 实例
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${store.user?.token}`
    },
    query: {
      orderId: route.query.orderId
    }
  })

  socket.on('connect', () => {
    // 建立连接成功
    console.log('connect')
  })

  socket.on('error', () => {
    // 错误异常消息
    console.log('error')
  })

  socket.on('disconnect', () => {
    // 已经断开连接
    console.log('disconnect')
  })

  // 获取初始聊天记录
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    // 并将消息的创建时间createTime转化成一条消息，即Message类型，这样将二维数组转化为一维数组便于渲染
    const arr: Message[] = []
    data.forEach((item, i) => {
      if (i === 0) time.value = item.createTime
      arr.push({
        msgType: MsgType.Notify, // 枚举类型，消息类型是通用消息
        msg: { content: item.createTime }, // 展示普通文本，消息内容为createTime
        createTime: item.createTime,
        id: item.createTime // 用createTime当作消息的id
      })
      arr.push(...item.items) // 解构出Message[] 每一项，最终得到arr这个一维数组来渲染页面
    })
    // 追加到聊天消息列表
    list.value.unshift(...arr)
    loading.value = false
    if (!data.length) {
      return showToast('没有聊天记录了')
    }
    if (initialMsg.value) {
      socket.emit('updateMsgStatus', arr[arr.length - 1].id)
      // 第一次需要滚动到最新的消息
      nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight)
        initialMsg.value = false
      })
    }
  })

  // 订单状态改变时重新获取问诊室订单详情信息来更新订单状态
  socket.on('statusChange', async () => {
    const res = await getConsultOrderDetail(route.query.orderId as string)
    consult.value = res.data
  })

  // 接收聊天消息（包括自己发出后返回的消息）
  socket.on('receiveChatMsg', async (event) => {
    list.value.push(event)
    await nextTick() // 简单理解为DOM更新后触发，执行完nextTick()后也代表DOM更新完成了
    // 通过 nextTick 方法，我们可以确保在 DOM 更新完成后执行某些操作。
    socket.emit('updateMsgStatus', event.id)
    window.scrollTo(0, document.body.scrollHeight)
  })
})

const sendText = (text: string) => {
  // 发送信息需要  发送人  收消息人  消息类型  消息内容
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: { content: text }
  })
}

const sendImage = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: img }
  })
}

const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const loading = ref(false)
const onRefresh = () => {
  socket.emit('getChatMsgList', 20, time.value, route.query.orderId)
}

// 是否是第一次获取聊天记录
const initialMsg = ref(true)
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室" />
    <!-- 状态栏 -->
    <room-status :status="consult?.status" :countdown="consult?.countdown" />
    <!-- 消息 -->
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <room-message v-for="item in list" :key="item.id" :item="item" />
    </van-pull-refresh>
    <!-- 操作栏 -->
    <room-action
      :disabled="consult?.status !== OrderType.ConsultChat"
      @send-text="sendText"
      @send-image="sendImage"
    ></room-action>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>

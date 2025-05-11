<script setup lang="ts">
import type {
  KnowledgeType,
  KnowledgeParams,
  KnowledgeList
} from '@/types/consult'
import { getKnowledgePage } from '@/services/consult'
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'

const props = defineProps<{
  type: KnowledgeType
}>()

// 是否在加载中
const loading = ref(false)
// 是否完全加载完毕，加载完毕会显示没有更多数据了，配合finished-text="没有更多了"使用
const finished = ref(false)

// 数据列表
const list = ref<KnowledgeList>([])
// 查询参数
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10
})
// 发请求加载列表数据
const onLoad = async () => {
  // 加载更多
  const res = await getKnowledgePage(params.value)
  list.value.push(...res.data.rows)
  // 判断已经加载完毕了
  if (params.value.current >= res.data.pageTotal) {
    finished.value = true
  } else {
    params.value.current++
  }
  loading.value = false
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>

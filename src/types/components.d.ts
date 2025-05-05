import type Cpicon from '@/components/CpIcon.vue'
import CpNavBar from '@/components/CpNavBar.vue'

declare module 'vue' {
  interface GlobalComponents {
    // 添加组件类型
    CpNavBar: typeof CpNavBar // typeof CpNavBar：从CpNavBar中得到组件类型
    CpIcon: typeof Cpicon
  }
}

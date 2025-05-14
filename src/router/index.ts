import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
// 导入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  showSpinner: false
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/user/patient',
      component: () => import('@/views/layout/User/PatientPage.vue'),
      meta: { title: '家庭档案' }
    },
    {
      path: '/consult/fast',
      component: () => import('@/views/Consult/ConsultFast.vue'),
      meta: { title: '极速问诊' }
    },
    {
      path: '/consult/dep',
      component: () => import('@/views/Consult/ConsultDep.vue'),
      meta: { title: '选择科室' }
    },
    {
      path: '/consult/illness',
      component: () => import('@/views/Consult/ConsultIllness.vue'),
      meta: { title: '病情描述' }
    },
    {
      path: '/consult/pay',
      component: () => import('@/views/Consult/ConsultPay.vue'),
      meta: { title: '问诊支付' }
    },
    {
      path: '/room',
      component: () => import('@/views/Room/index.vue'),
      meta: { title: '问诊室' },
      beforeEnter(to) {
        if (to.query.payResult === 'false') return '/user/consult'
      }
    },
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/layout/Home/index.vue'),
          meta: { title: '首页' }
        },
        {
          path: '/user',
          component: () => import('@/views/layout/User/index.vue'),
          meta: { title: '健康百科' }
        },
        {
          path: '/notify',
          component: () => import('@/views/layout/Notify/index.vue'),
          meta: { title: '消息通知' }
        },
        {
          path: '/article',
          component: () => import('@/views/layout/Article/index.vue'),
          meta: { title: '个人中心' }
        }
      ]
    }
  ]
})

// 访问权限控制
router.beforeEach((to) => {
  // 开启进度条
  NProgress.start()
  // 用户仓库
  const store = useUserStore()
  // 不需要登录的页面，白名单
  const wihteList = ['/login']
  // 如果没有登录且不在白名单内，去登录
  if (!store.user?.token && !wihteList.includes(to.path)) return '/login'
  // 否则不做任何处理
})

router.afterEach((to) => {
  document.title = `${to.meta.title || ''}-医疗问诊`
  // 关闭进度条
  NProgress.done()
})

export default router

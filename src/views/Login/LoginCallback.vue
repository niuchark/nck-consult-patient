<script setup lang="ts">
/*global QC*/
// 上面的注释是告诉ESlintQC是个全局变量避免报错
import { onMounted, ref } from 'vue'
import { mobileRules, codeRules } from '@/utils/rules'
import { useSendCode } from '@/composables'
import { bindMobile, loginByQQ } from '@/services/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import type { User } from '@/types/user'
import { showSuccessToast } from 'vant'

const openId = ref('')
// 是否需要绑定手机号
const isNeedBind = ref(false)
onMounted(() => {
  // check函数返回是否已经QQ登陆
  if (QC.Login.check()) {
    QC.Login.getMe((id) => {
      openId.value = id
      // QQ，登录
      loginByQQ(id)
        .then((res) => {
          // 登录成功
          loginSuccess(res)
        })
        .catch(() => {
          // 登录失败
          isNeedBind.value = true
        })
    })
  }
})

const mobile = ref('')
const code = ref('')
const { onSend, time, form } = useSendCode(mobile)

// 登录成功的逻辑（直接QQ登陆成功和绑定手机后登陆成功都需要）
const store = useUserStore()
const router = useRouter()
const loginSuccess = (res: { data: User }) => {
  store.setUser(res.data)
  router.replace('/user')
  showSuccessToast('登录成功')
  store.setReturnUrl('')
}

// 绑定手机号
const bind = async () => {
  const res = await bindMobile({
    mobile: mobile.value,
    code: code.value,
    openId: openId.value
  })
  loginSuccess(res)
}
</script>

<template>
  <div class="login-page" v-if="isNeedBind">
    <cp-nav-bar></cp-nav-bar>
    <div class="login-head">
      <h3>手机绑定</h3>
    </div>
    <van-form autocomplete="off" ref="form" @submit="bind">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
      ></van-field>
      <van-field
        v-model="code"
        name="code"
        placeholder="请输入验证码"
        :rules="codeRules"
      >
        <template #button>
          <span
            class="btn-send"
            @click="onSend"
            :class="{ active: time > 0 }"
            >{{ time > 0 ? `${time}s后再次发送` : '发送验证码' }}</span
          > </template
        >>
      </van-field>
      <div class="cp-cell">
        <van-button
          style="margin-top: 50px"
          block
          round
          type="primary"
          native-type="submit"
        >
          立即绑定
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/login.scss';
</style>

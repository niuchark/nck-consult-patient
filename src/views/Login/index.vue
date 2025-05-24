<script setup lang="ts">
import { ref } from 'vue'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { showSuccessToast, showToast } from 'vant'
import { loginByMobile, loginByPassword } from '@/services/user'
import { useUserStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'
import { useSendCode } from '@/composables'

const mobile = ref('')
const password = ref('')
const agree = ref(false) // 判断是否勾选用户协议
const store = useUserStore()
const router = useRouter() // 拿到路由实例
const route = useRoute() // 拿到路由信息对象
const onSubmit = async () => {
  if (!agree.value) return showToast('请先同意用户协议')
  // 发起登陆请求 （合并短信登陆和密码登陆）
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByMobile(mobile.value, code.value)
  store.setUser(res.data)
  showSuccessToast('登录成功')
  router.replace((route.query.returnUrl as string) || '/user') // 如果有returnUrl就跳转到returnUrl，没有就跳转到/user
}

// 短信登陆界面切换
const isPass = ref(true)
const code = ref('') // 短信验证码

// 发送短信验证码
const { onSend, time, form } = useSendCode(mobile)

// 控制密码的可见和不可见
const isShow = ref()
</script>

<template>
  <div class="login-page">
    <cp-nav-bar
      right-text="注册"
      @click-right="$router.push('/register')"
    ></cp-nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登陆' : '短信验证码登陆' }}</h3>
      <a href="javascript:;">
        <span @click="isPass = !isPass">{{
          isPass ? '短信验证码登陆' : '密码登陆'
        }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form autocomplete="off" ref="form">
      <van-field
        name="mobile"
        v-model="mobile"
        placeholder="请输入手机号"
        type="tel"
        :rules="mobileRules"
      ></van-field>
      <van-field
        v-model="password"
        placeholder="请输入密码"
        :type="`${isShow ? 'text' : 'password'}`"
        :rules="passwordRules"
        v-if="isPass"
      >
        <template #button>
          <cp-icon
            :name="`login-eye-${isShow ? 'on' : 'off'}`"
            style="margin-right: 10px"
            @click="isShow = !isShow"
          ></cp-icon>
        </template>
      </van-field>
      <van-field
        placeholder="短信验证码"
        v-model="code"
        v-else
        :rules="codeRules"
      >
        <template #button>
          <span
            class="btn-send"
            @click="onSend"
            :class="{ active: time > 0 }"
            >{{ time > 0 ? `${time}s后再次发送` : '发送验证码' }}</span
          >
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button
          native-type="submit"
          block
          round
          type="primary"
          @click="onSubmit"
        >
          登 录</van-button
        >
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <a
          @click="store.setReturnUrl(route.query.returnUrl as string)"
          class="icon"
          href="https://graph.qq.com/oauth2.0/authorize?client_id=102015968&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fconsult-patients.itheima.net%2Flogin%2Fcallback"
        >
          <img src="@/assets/qq.svg" alt="" />
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/login.scss';
</style>

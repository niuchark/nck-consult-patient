<script setup lang="ts">
const fn = () => {
  console.log('点击了右侧按钮')
}
</script>

<template>
  <div class="login-page">
    <cp-nav-bar title="登陆" right-text="注册" @click-right="fn"></cp-nav-bar>
  </div>
</template>

<style scoped lang="scss"></style>

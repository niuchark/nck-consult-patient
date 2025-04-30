<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Button as VanButton } from 'vant'
</script>

<template>
  <div>App <van-button type="primary">按钮</van-button></div>
  <div class="main">main</div>
  <div class="footer">footer</div>
  <RouterView />
</template>

<style scoped lang="scss">
.main {
  color: var(--main-color);
}

.footer {
  color: var(--main-color);
}
</style>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <!-- 一级路由出口 -->
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.main {
  color: var(--main-color);
}

.footer {
  color: var(--main-color);
}
</style>

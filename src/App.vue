<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- 一级路由出口 -->
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

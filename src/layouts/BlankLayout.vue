<template>
  <div class="blank-layout">
    <router-view />
  </div>
</template>

<script setup>
// 空白布局，用于登录、注册等全屏页
</script>

<style lang="scss" scoped>
.blank-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>

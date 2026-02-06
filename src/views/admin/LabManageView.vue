<template>
  <div class="admin-lab">
    <el-card>
      <template #header>
        <span>实验室管理（管理员）</span>
      </template>
      <p>与「实验室管理」页面功能一致，可在此做统计或跳转到 /lab/manage。</p>
      <el-button type="primary" @click="$router.push('/lab/manage')">前往实验室管理</el-button>
    </el-card>
  </div>
</template>

<script setup>
// 管理员视角的实验室管理入口
</script>

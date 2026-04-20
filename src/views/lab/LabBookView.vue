<template>
  <div class="lab-book-redirect">
    <el-result
      icon="info"
      title="预约入口已升级"
      sub-title="预约表单已合并到实验室详情页，正在为你跳转。"
    >
      <template #extra>
        <el-button type="primary" @click="goNow">立即前往</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const targetPath = computed(() => {
  const id = route.query.id
  return id ? `/lab/detail/${id}` : '/lab/list'
})

function goNow() {
  router.replace({
    path: targetPath.value,
    query: {
      date: route.query.date || undefined,
      slot: route.query.slot || undefined,
    },
  })
}

onMounted(goNow)
</script>

<style lang="scss" scoped>
.lab-book-redirect {
  padding: 24px;
}
</style>

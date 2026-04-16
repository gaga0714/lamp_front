<template>
  <div class="lab-detail">
    <el-card v-loading="loading">
      <template #header>
        <span>{{ detail?.name ?? '实验室详情' }}</span>
        <el-button type="primary" style="float: right" :disabled="detail?.status !== 'available'" @click="$router.push({ path: '/lab/book', query: { id: detail?.id } })">
          预约
        </el-button>
      </template>
      <div v-if="detail" class="detail-content">
        <p><strong>位置：</strong>{{ detail.location || '暂无' }}</p>
        <p><strong>描述：</strong>{{ detail.description || '暂无' }}</p>
        <p><strong>容量：</strong>{{ detail.capacity ?? '-' }} 人</p>
        <p><strong>状态：</strong>
          <el-tag :type="detail.status === 'available' ? 'success' : 'info'">
            {{ detail.status === 'available' ? '可预约' : '维护中' }}
          </el-tag>
        </p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getLabDetail } from '@/api/lab'

const route = useRoute()
const id = computed(() => route.params.id)
const detail = ref(null)
const loading = ref(false)

async function loadDetail() {
  if (!id.value) return
  loading.value = true
  try {
    detail.value = await getLabDetail(id.value)
  } finally {
    loading.value = false
  }
}

onMounted(loadDetail)
</script>

<style lang="scss" scoped>
.detail-content p {
  margin-bottom: 12px;
}
</style>

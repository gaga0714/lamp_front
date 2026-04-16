<template>
  <div class="lab-detail">
    <el-card v-loading="loading">
      <template #header>
        <span>{{ detail?.name ?? '实验室详情' }}</span>
        <el-button type="primary" style="float: right" :disabled="detail?.status !== 'available'" @click="goBook">
          预约
        </el-button>
      </template>
      <div v-if="detail" class="detail-content">
        <p><strong>实验室编号：</strong>{{ detail.id }}</p>
        <p><strong>位置：</strong>{{ detail.location || '暂无' }}</p>
        <p><strong>描述：</strong>{{ detail.description || '暂无' }}</p>
        <p><strong>可用设备：</strong>{{ detail.equipmentInfo || '暂无' }}</p>
        <p><strong>容量：</strong>{{ detail.capacity ?? '-' }} 人</p>
        <p><strong>状态：</strong>
          <el-tag :type="detail.status === 'available' ? 'success' : 'info'">
            {{ detail.status === 'available' ? '可预约' : '维护中' }}
          </el-tag>
        </p>
        <el-divider />
        <div class="availability-panel">
          <el-form :inline="true">
            <el-form-item label="预约日期">
              <el-date-picker v-model="filters.date" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 180px" />
            </el-form-item>
            <el-form-item label="预约时段">
              <el-select v-model="filters.slot" placeholder="请选择时段" clearable style="width: 160px">
                <el-option v-for="item in slotOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadDetail">查询可预约状态</el-button>
            </el-form-item>
          </el-form>
          <div v-if="filters.date && filters.slot" class="availability-status">
            <el-tag :type="detail.currentSlotAvailable ? 'success' : 'warning'">
              {{ detail.currentSlotAvailable ? '当前日期时段可预约' : '当前日期时段不可预约' }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLabDetail } from '@/api/lab'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id)
const detail = ref(null)
const loading = ref(false)
const filters = reactive({
  date: route.query.date ?? '',
  slot: route.query.slot ?? '',
})
const slotOptions = ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00']

async function loadDetail() {
  if (!id.value) return
  loading.value = true
  try {
    detail.value = await getLabDetail(id.value, {
      date: filters.date || undefined,
      slot: filters.slot || undefined,
    })
  } finally {
    loading.value = false
  }
}

function goBook() {
  router.push({
    path: '/lab/book',
    query: {
      id: detail.value?.id,
      date: filters.date || undefined,
      slot: filters.slot || undefined,
    },
  })
}

onMounted(loadDetail)
</script>

<style lang="scss" scoped>
.detail-content p {
  margin-bottom: 12px;
}
.availability-panel {
  margin-top: 16px;
}
.availability-status {
  margin-top: 4px;
}
</style>

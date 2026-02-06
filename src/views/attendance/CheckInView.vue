<template>
  <div class="check-in">
    <el-card>
      <template #header>
        <span>考勤签到</span>
      </template>
      <div class="check-in-content">
        <p class="current-time">{{ currentTime }}</p>
        <p class="current-date">{{ currentDate }}</p>
        <el-button type="primary" size="large" :loading="loading" @click="handleCheckIn">
          {{ todayCheckedIn ? '签退' : '签到' }}
        </el-button>
        <p v-if="todayCheckedIn" class="tip">今日已签到，可点击签退</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { checkIn } from '@/api/attendance'

const currentTime = ref('')
const currentDate = ref('')
const todayCheckedIn = ref(false)
const loading = ref(false)
let timer = null

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
  currentDate.value = now.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

async function handleCheckIn() {
  loading.value = true
  try {
    await checkIn({ type: todayCheckedIn.value ? 'out' : 'in' })
    todayCheckedIn.value = !todayCheckedIn.value
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style lang="scss" scoped>
.check-in-content {
  text-align: center;
  padding: 40px 0;
  .current-time {
    font-size: 48px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .current-date {
    color: #909399;
    margin-bottom: 24px;
  }
  .tip {
    margin-top: 12px;
    font-size: 12px;
    color: #909399;
  }
}
</style>

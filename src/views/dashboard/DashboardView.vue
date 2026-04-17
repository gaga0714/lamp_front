<template>
  <div class="dashboard">
    <h2>工作台</h2>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="40" color="#409eff"><Calendar /></el-icon>
            <div>
              <div class="stat-value">{{ firstStatValue }}</div>
              <div class="stat-label">{{ firstStatLabel }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="40" color="#67c23a"><OfficeBuilding /></el-icon>
            <div>
              <div class="stat-value">{{ secondStatValue }}</div>
              <div class="stat-label">{{ secondStatLabel }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="40" color="#e6a23c"><Document /></el-icon>
            <div>
              <div class="stat-value">{{ thirdStatValue }}</div>
              <div class="stat-label">{{ thirdStatLabel }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="40" color="#f56c6c"><Bell /></el-icon>
            <div>
              <div class="stat-value">{{ fourthStatValue }}</div>
              <div class="stat-label">{{ fourthStatLabel }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="quick-actions" shadow="hover">
      <template #header>快捷入口</template>
      <div class="actions">
        <template v-if="role === 'student'">
          <el-button type="primary" @click="$router.push('/course/student/schedule')">我的课表</el-button>
          <el-button @click="$router.push('/attendance/check-in')">课程签到</el-button>
          <el-button @click="$router.push('/attendance/records')">课程考勤</el-button>
          <el-button @click="$router.push('/attendance/leave/apply')">课程请假</el-button>
          <el-button @click="$router.push('/attendance/leave/list')">我的请假</el-button>
          <el-button @click="$router.push('/lab/my-bookings')">我的预约</el-button>
        </template>
        <template v-else-if="role === 'teacher'">
          <el-button type="primary" @click="$router.push('/course/teacher/schedule')">我的授课</el-button>
          <el-button @click="$router.push('/attendance/course/manage')">课程考勤管理</el-button>
          <el-button type="primary" @click="$router.push('/attendance/leave/approve')">请假审批</el-button>
          <el-button @click="$router.push('/lab/my-bookings')">我的预约</el-button>
        </template>
        <template v-else-if="role === 'admin'">
          <el-button type="primary" @click="$router.push('/course/manage')">课表管理</el-button>
          <el-button @click="$router.push('/attendance/manage')">考勤总览</el-button>
        </template>
        <el-button @click="$router.push('/lab/list')">实验室列表</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { getDashboardStats } from '@/api/dashboard'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const role = computed(() => userStore.role)
const stats = ref({
  card1Label: '卡片一',
  card1Value: 0,
  card2Label: '卡片二',
  card2Value: 0,
  card3Label: '卡片三',
  card3Value: 0,
  card4Label: '卡片四',
  card4Value: 0,
})

const firstStatValue = computed(() => stats.value.card1Value)
const secondStatValue = computed(() => stats.value.card2Value)
const thirdStatValue = computed(() => stats.value.card3Value)
const fourthStatValue = computed(() => stats.value.card4Value)
const firstStatLabel = computed(() => stats.value.card1Label)
const secondStatLabel = computed(() => stats.value.card2Label)
const thirdStatLabel = computed(() => stats.value.card3Label)
const fourthStatLabel = computed(() => stats.value.card4Label)

async function loadStats() {
  const res = await getDashboardStats().catch(() => ({}))
  stats.value = {
    card1Label: res?.card1Label ?? '卡片一',
    card1Value: res?.card1Value ?? 0,
    card2Label: res?.card2Label ?? '卡片二',
    card2Value: res?.card2Value ?? 0,
    card3Label: res?.card3Label ?? '卡片三',
    card3Value: res?.card3Value ?? 0,
    card4Label: res?.card4Label ?? '卡片四',
    card4Value: res?.card4Value ?? 0,
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style lang="scss" scoped>
.dashboard {
  h2 {
    margin-bottom: 20px;
    font-size: 20px;
  }
}
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  .stat-value {
    font-size: 24px;
    font-weight: 600;
  }
  .stat-label {
    font-size: 14px;
    color: #909399;
  }
}
.quick-actions {
  margin-top: 20px;
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>

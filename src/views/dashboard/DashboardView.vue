<template>
  <div class="dashboard">
    <section class="hero-card">
      <div class="hero-content">
        <div>
          <p class="eyebrow">欢迎使用</p>
          <h2>{{ dashboardTitle }}</h2>
          <p class="description">{{ dashboardDescription }}</p>
        </div>
        <el-tag type="success" effect="light" round>{{ roleLabel }}</el-tag>
      </div>
    </section>

    <el-row :gutter="16" class="card-grid">
      <el-col
        v-for="item in dashboardCards"
        :key="item.label"
        :xs="24"
        :sm="12"
        :lg="6"
      >
        <el-card class="dashboard-card" shadow="hover" @click="go(item.route)">
          <div class="card-top">
            <div class="icon-box" :style="{ background: item.iconBg, color: item.iconColor }">
              <el-icon :size="26"><component :is="item.icon" /></el-icon>
            </div>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
          <div class="card-value">{{ item.value }}</div>
          <div class="card-label">{{ item.label }}</div>
          <div class="card-desc">{{ item.desc }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Bell, Calendar, Collection, Document, Memo, OfficeBuilding, Reading } from '@element-plus/icons-vue'
import { getDashboardStats } from '@/api/dashboard'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const role = computed(() => userStore.role)
const roleLabel = computed(() => {
  const map = {
    student: '学生工作台',
    teacher: '教师工作台',
    admin: '实验室管理员工作台',
  }
  return map[role.value] ?? '工作台'
})
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

const dashboardTitle = computed(() => {
  if (role.value === 'student') return '课程学习与实验室预约一体化入口'
  if (role.value === 'teacher') return '授课管理与实验室预约一体化入口'
  if (role.value === 'admin') return '实验室资源管理与预约审批入口'
  return '系统工作台'
})

const dashboardDescription = computed(() => {
  if (role.value === 'student') return '在这里快速进入我的课表、课程签到、请假与实验室预约相关功能。'
  if (role.value === 'teacher') return '在这里快速处理授课安排、课程考勤和请假审批，同时保留实验室预约能力。'
  if (role.value === 'admin') return '在这里集中处理实验室管理、预约审批与实验室使用统计。'
  return '统一查看关键数据并进入常用功能。'
})

const dashboardCards = computed(() => {
  const common = [
    {
      label: stats.value.card1Label,
      value: stats.value.card1Value,
      desc: '',
      route: '/',
      icon: Calendar,
      iconBg: 'rgba(78, 114, 170, 0.12)',
      iconColor: '#4e72aa',
    },
    {
      label: stats.value.card2Label,
      value: stats.value.card2Value,
      desc: '',
      route: '/',
      icon: OfficeBuilding,
      iconBg: 'rgba(85, 139, 104, 0.12)',
      iconColor: '#558b68',
    },
    {
      label: stats.value.card3Label,
      value: stats.value.card3Value,
      desc: '',
      route: '/',
      icon: Document,
      iconBg: 'rgba(196, 143, 74, 0.12)',
      iconColor: '#c48f4a',
    },
    {
      label: stats.value.card4Label,
      value: stats.value.card4Value,
      desc: '',
      route: '/',
      icon: Bell,
      iconBg: 'rgba(190, 92, 92, 0.12)',
      iconColor: '#be5c5c',
    },
  ]

  if (role.value === 'student') {
    common[0].route = '/course/student/schedule'
    common[0].icon = Memo
    common[0].desc = '查看本周课程安排'
    common[1].route = '/attendance/check-in'
    common[1].icon = Calendar
    common[1].desc = '进入课程签到'
    common[2].route = '/attendance/leave/list'
    common[2].icon = Document
    common[2].desc = '查看我的课程请假'
    common[3].route = '/lab/my-bookings'
    common[3].icon = OfficeBuilding
    common[3].desc = '查看我的实验室预约'
  } else if (role.value === 'teacher') {
    common[0].route = '/course/teacher/schedule'
    common[0].icon = Reading
    common[0].desc = '查看本周授课安排'
    common[1].route = '/course/teacher/schedule'
    common[1].icon = Calendar
    common[1].desc = '查看今日课程安排'
    common[2].route = '/attendance/leave/approve'
    common[2].icon = Document
    common[2].desc = '处理课程请假审批'
    common[3].route = '/lab/my-bookings'
    common[3].icon = OfficeBuilding
    common[3].desc = '查看我的实验室预约'
  } else if (role.value === 'admin') {
    common[0].route = '/lab/manage'
    common[0].icon = Collection
    common[0].desc = '维护实验室基础信息'
    common[1].route = '/lab/usage-stats'
    common[1].icon = OfficeBuilding
    common[1].desc = '查看本月真实使用率'
    common[2].route = '/lab/approve'
    common[2].icon = Document
    common[2].desc = '处理待审批预约'
    common[3].route = '/lab/list'
    common[3].icon = Bell
    common[3].desc = '查看今日实验室预约相关情况'
  }

  return common
})

function go(path) {
  if (path) {
    router.push(path)
  }
}

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

onMounted(loadStats)
</script>

<style lang="scss" scoped>
.dashboard {
  .hero-card {
    margin-bottom: 18px;
    padding: 24px 28px;
    border-radius: 20px;
    background: linear-gradient(135deg, #f8fbff 0%, #eef5fb 100%);
    border: 1px solid rgba(78, 114, 170, 0.12);
    box-shadow: 0 10px 30px rgba(47, 79, 111, 0.06);
  }

  .hero-content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .eyebrow {
    margin-bottom: 8px;
    color: #6b7f93;
    font-size: 13px;
  }

  h2 {
    margin-bottom: 10px;
    font-size: 28px;
    line-height: 1.3;
    color: #2f4f6f;
  }

  .description {
    max-width: 720px;
    color: #5f7083;
    line-height: 1.7;
  }
}

.card-grid {
  .el-col {
    margin-bottom: 16px;
  }
}

.dashboard-card {
  border-radius: 18px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid rgba(47, 79, 111, 0.08);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(47, 79, 111, 0.12);
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.icon-box {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: grid;
  place-items: center;
}

.arrow-icon {
  color: #9aa9b8;
}

.card-value {
  font-size: 30px;
  font-weight: 700;
  color: #2f4f6f;
}

.card-label {
  margin-top: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #394a59;
}

.card-desc {
  margin-top: 6px;
  min-height: 40px;
  font-size: 13px;
  line-height: 1.6;
  color: #7c8d9d;
}

@media (max-width: 991px) {
  .dashboard {
    .hero-card {
      padding: 20px;
    }

    h2 {
      font-size: 22px;
    }
  }
}

@media (max-width: 767px) {
  .dashboard {
    .hero-content {
      flex-direction: column;
    }
  }

  .card-value {
    font-size: 26px;
  }
}
</style>

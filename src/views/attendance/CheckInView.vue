<template>
  <div class="check-in">
    <el-card>
      <template #header>
        <span>课程签到</span>
      </template>
      <div class="check-in-content">
        <p class="current-time">{{ currentTime }}</p>
        <p class="current-date">{{ currentDate }}</p>
        <el-date-picker v-model="selectedDate" type="date" value-format="YYYY-MM-DD" @change="loadCourses" />
      </div>

      <el-empty v-if="!list.length" description="所选日期暂无课程安排" />
      <el-table v-else :data="list" border stripe>
        <el-table-column prop="courseCode" label="课程编号" width="120" />
        <el-table-column prop="courseName" label="课程名称" min-width="180" />
        <el-table-column prop="teacherName" label="授课教师" width="120" />
        <el-table-column prop="courseDate" label="日期" width="120" />
        <el-table-column prop="courseTime" label="时间" width="160" />
        <el-table-column prop="location" label="地点" width="140" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" link :disabled="!row.canCheckIn" :loading="loadingId === row.id" @click="handleCheckIn(row)">
              签到
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { checkIn } from '@/api/attendance'
import { getStudentCourseOptions } from '@/api/course'

const currentTime = ref('')
const currentDate = ref('')
const selectedDate = ref(formatDate(new Date()))
const list = ref([])
const loadingId = ref(null)
let timer = null

function formatDate(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
  currentDate.value = now.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function statusType(status) {
  const map = { 已签到: 'success', 迟到: 'warning', 请假: 'info', 缺勤: 'danger', 待签到: '' }
  return map[status] ?? 'info'
}

async function loadCourses() {
  const res = await getStudentCourseOptions({ date: selectedDate.value }).catch(() => ({ list: [] }))
  list.value = res?.list ?? []
}

async function handleCheckIn(row) {
  loadingId.value = row.id
  try {
    await checkIn({ courseId: row.id, courseDate: row.courseDate })
    ElMessage.success('签到成功')
    loadCourses()
  } finally {
    loadingId.value = null
  }
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  loadCourses()
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
}
</style>

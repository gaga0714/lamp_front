<template>
  <div class="schedule-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>我的课表</span>
          <div class="toolbar">
            <el-button @click="changeWeek(-1)">上一周</el-button>
            <el-date-picker v-model="weekAnchor" type="date" value-format="YYYY-MM-DD" @change="handleWeekChange" />
            <el-button @click="changeWeek(1)">下一周</el-button>
          </div>
        </div>
      </template>

      <el-table :data="list" border stripe>
        <el-table-column prop="courseDate" label="日期" width="120" />
        <el-table-column prop="courseCode" label="课程编号" width="120" />
        <el-table-column prop="courseName" label="课程名称" min-width="180" />
        <el-table-column prop="teacherName" label="授课教师" width="120" />
        <el-table-column prop="courseTime" label="上课时间" width="160" />
        <el-table-column prop="location" label="地点" width="140" />
        <el-table-column prop="weeks" label="周次" width="100" />
        <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getStudentSchedule } from '@/api/course'

const list = ref([])
const weekAnchor = ref(todayString())

function todayString() {
  return formatDate(new Date())
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getMonday(dateString) {
  const date = new Date(dateString)
  const day = date.getDay() || 7
  date.setDate(date.getDate() - day + 1)
  return formatDate(date)
}

async function loadList() {
  const res = await getStudentSchedule({ weekStart: getMonday(weekAnchor.value) }).catch(() => ({ list: [] }))
  list.value = res?.list ?? []
}

function changeWeek(offset) {
  const date = new Date(weekAnchor.value)
  date.setDate(date.getDate() + offset * 7)
  weekAnchor.value = formatDate(date)
  loadList()
}

function handleWeekChange() {
  loadList()
}

onMounted(loadList)
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>

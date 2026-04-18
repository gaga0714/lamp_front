<template>
  <div class="course-attendance-manage">
    <el-card>
      <template #header>
        <span>课程考勤管理</span>
      </template>

      <el-form :inline="true" class="filter-form">
        <el-form-item label="上课日期">
          <el-date-picker v-model="date" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="课程">
          <el-select v-model="courseId" placeholder="全部课程" clearable style="width: 280px">
            <el-option
              v-for="item in courseOptions"
              :key="item.id"
              :label="`${item.courseCode} ${item.courseName}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="list" border stripe>
        <el-table-column prop="courseCode" label="课程编号" width="120" />
        <el-table-column prop="courseName" label="课程名称" min-width="160" />
        <el-table-column prop="name" label="学生姓名" width="120" />
        <el-table-column prop="username" label="学号" width="130" />
        <el-table-column prop="courseDate" label="日期" width="120" />
        <el-table-column prop="courseTime" label="时间" width="160" />
        <el-table-column prop="location" label="地点" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="checkInTime" label="签到时间" width="180" />
        <el-table-column prop="remark" label="备注" min-width="160" show-overflow-tooltip />
      </el-table>

      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        class="pagination"
        @current-change="loadList"
      />
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getTeacherAttendanceList, getTeacherCourseOptions } from '@/api/course'

function formatDate(value) {
  const year = value.getFullYear()
  const month = `${value.getMonth() + 1}`.padStart(2, '0')
  const day = `${value.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const date = ref(formatDate(new Date()))
const courseId = ref(null)
const courseOptions = ref([])
const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

function statusType(status) {
  const map = { 已签到: 'success', 迟到: 'warning', 请假: 'info', 缺勤: 'danger', 待签到: '' }
  return map[status] ?? 'info'
}

async function loadOptions() {
  const res = await getTeacherCourseOptions().catch(() => ({ list: [] }))
  courseOptions.value = res?.list ?? []
}

async function loadList() {
  const res = await getTeacherAttendanceList({
    page: page.value,
    pageSize: pageSize.value,
    courseId: courseId.value,
    date: date.value,
  }).catch(() => ({ list: [], total: 0 }))
  list.value = res?.list ?? []
  total.value = res?.total ?? 0
}

function handleSearch() {
  page.value = 1
  loadList()
}

onMounted(async () => {
  await loadOptions()
  loadList()
})
</script>

<style scoped lang="scss">
.filter-form {
  margin-bottom: 16px;
}

.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>

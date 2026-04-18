<template>
  <div class="course-manage">
    <el-card>
      <template #header>
        <span>课表管理</span>
      </template>

      <el-form :inline="true" class="filter-form">
        <el-form-item label="课程关键词">
          <el-input v-model="keyword" placeholder="课程编号或名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="list" border stripe>
        <el-table-column prop="courseCode" label="课程编号" width="120" />
        <el-table-column prop="courseName" label="课程名称" min-width="180" />
        <el-table-column prop="teacherName" label="授课教师" width="120" />
        <el-table-column prop="semester" label="学期" width="140" />
        <el-table-column prop="weeks" label="周次" width="100" />
        <el-table-column prop="weekday" label="星期" width="90">
          <template #default="{ row }">
            {{ weekdayText(row.weekday) }}
          </template>
        </el-table-column>
        <el-table-column label="时间" width="160">
          <template #default="{ row }">
            {{ row.startTime }}-{{ row.endTime }}
          </template>
        </el-table-column>
        <el-table-column prop="location" label="地点" width="140" />
        <el-table-column prop="studentCount" label="选课人数" width="100" />
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
import { getAdminCourseList } from '@/api/course'

const keyword = ref('')
const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

function weekdayText(value) {
  return ['','周一', '周二', '周三', '周四', '周五', '周六', '周日'][value] || '--'
}

async function loadList() {
  const res = await getAdminCourseList({
    page: page.value,
    pageSize: pageSize.value,
    keyword: keyword.value,
  }).catch(() => ({ list: [], total: 0 }))
  list.value = res?.list ?? []
  total.value = res?.total ?? 0
}

function handleSearch() {
  page.value = 1
  loadList()
}

onMounted(loadList)
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

<template>
  <div class="attendance-manage">
    <el-card>
      <template #header>
        <span>考勤管理</span>
      </template>
      <el-form :inline="true" class="filter-form">
        <el-form-item label="日期">
          <el-date-picker v-model="date" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="学号/姓名">
          <el-input v-model="keyword" placeholder="学号或姓名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadList">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" border stripe>
        <el-table-column prop="username" label="学号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="checkInTime" label="签到时间" />
        <el-table-column prop="checkOutTime" label="签退时间" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next"
        class="pagination"
        @current-change="loadList"
        @size-change="loadList"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAttendanceManageList } from '@/api/attendance'

const date = ref('')
const keyword = ref('')
const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

function statusType(s) {
  const map = { 正常: 'success', 迟到: 'warning', 早退: 'warning', 缺勤: 'danger' }
  return map[s] ?? 'info'
}

async function loadList() {
  const res = await getAttendanceManageList({
    page: page.value,
    pageSize: pageSize.value,
    date: date.value,
    keyword: keyword.value,
  }).catch(() => ({ list: [], total: 0 }))
  list.value = res?.list ?? res?.records ?? []
  total.value = res?.total ?? 0
}

onMounted(loadList)
</script>

<style lang="scss" scoped>
.filter-form {
  margin-bottom: 16px;
}
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>

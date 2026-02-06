<template>
  <div class="leave-list">
    <el-card>
      <template #header>
        <span>我的请假</span>
      </template>
      <el-table :data="list" border stripe>
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            {{ { personal: '事假', sick: '病假', other: '其他' }[row.type] ?? row.type }}
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="170" />
        <el-table-column prop="endTime" label="结束时间" width="170" />
        <el-table-column prop="reason" label="事由" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
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
import { getLeaveList } from '@/api/attendance'

const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

function statusType(s) {
  const map = { 待审批: 'warning', 已通过: 'success', 已驳回: 'danger' }
  return map[s] ?? 'info'
}

async function loadList() {
  const res = await getLeaveList({ page: page.value, pageSize: pageSize.value }).catch(() => ({ list: [], total: 0 }))
  list.value = res?.list ?? res?.records ?? []
  total.value = res?.total ?? 0
}

onMounted(loadList)
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>

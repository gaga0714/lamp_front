<template>
  <div class="my-bookings">
    <el-card>
      <template #header>
        <span>我的预约</span>
      </template>
      <el-table :data="list" border stripe>
        <el-table-column label="编号" width="90">
          <template #default="{ row }">
            {{ formatLabCode(row.labId) }}
          </template>
        </el-table-column>
        <el-table-column prop="labName" label="实验室" width="140" />
        <el-table-column prop="location" label="位置" width="140" show-overflow-tooltip />
        <el-table-column prop="capacity" label="容量" width="80" />
        <el-table-column prop="equipmentInfo" label="设备" min-width="180" show-overflow-tooltip />
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="slot" label="时段" width="120" />
        <el-table-column prop="purpose" label="用途" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === '待审批'" type="danger" link size="small" @click="handleCancel(row)">取消</el-button>
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
import { ElMessageBox, ElMessage } from 'element-plus'
import { getMyBookings, cancelBooking } from '@/api/lab'
import { formatLabCode } from '@/utils/format'

const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

function statusType(s) {
  const map = { 待审批: 'warning', 已通过: 'success', 已拒绝: 'danger', 已使用: 'info', 已取消: 'info' }
  return map[s] ?? 'info'
}

async function loadList() {
  const res = await getMyBookings({ page: page.value, pageSize: pageSize.value }).catch(() => ({ list: [], total: 0 }))
  list.value = res?.list ?? res?.records ?? []
  total.value = res?.total ?? 0
}

async function handleCancel(row) {
  await ElMessageBox.confirm('确定取消该预约？', '提示', { type: 'warning' })
  await cancelBooking(row.id)
  ElMessage.success('已取消')
  loadList()
}

onMounted(loadList)
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>

<template>
  <div class="lab-usage-stats">
    <el-card>
      <template #header>
        <span>实验室真实使用率</span>
      </template>

      <el-form :inline="true" class="filter-form">
        <el-form-item label="开始日期">
          <el-date-picker v-model="filters.startDate" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="filters.endDate" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="实验室">
          <el-select v-model="filters.labId" clearable placeholder="全部实验室" style="width: 260px">
            <el-option
              v-for="item in labOptions"
              :key="item.id"
              :label="`${formatLabCode(item.id)} ${item.name}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="16" class="overview-row">
        <el-col :span="6"><el-card shadow="never" class="overview-card"><div class="value">{{ overview.effectiveBookingCount ?? 0 }}</div><div class="label">已生效预约数</div></el-card></el-col>
        <el-col :span="6"><el-card shadow="never" class="overview-card"><div class="value">{{ overview.actualUsageCount ?? 0 }}</div><div class="label">实际使用数</div></el-card></el-col>
        <el-col :span="6"><el-card shadow="never" class="overview-card"><div class="value">{{ overview.noShowCount ?? 0 }}</div><div class="label">爽约数</div></el-card></el-col>
        <el-col :span="6"><el-card shadow="never" class="overview-card"><div class="value">{{ formatRate(overview.usageRate) }}</div><div class="label">真实使用率</div></el-card></el-col>
      </el-row>

      <el-table :data="list" border stripe>
        <el-table-column label="编号" width="90">
          <template #default="{ row }">
            {{ formatLabCode(row.labId) }}
          </template>
        </el-table-column>
        <el-table-column prop="labName" label="实验室" width="160" />
        <el-table-column prop="location" label="位置" min-width="160" show-overflow-tooltip />
        <el-table-column prop="pendingBookingCount" label="待审批" width="90" />
        <el-table-column prop="effectiveBookingCount" label="已生效预约" width="110" />
        <el-table-column prop="actualUsageCount" label="实际使用" width="100" />
        <el-table-column prop="noShowCount" label="爽约数" width="90" />
        <el-table-column label="真实使用率" width="120">
          <template #default="{ row }">
            <el-tag :type="rateTagType(row.usageRate)">{{ formatRate(row.usageRate) }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        class="pagination"
        @current-change="loadData"
      />
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { getLabManageList, getLabUsageStats } from '@/api/lab'
import { formatLabCode } from '@/utils/format'

function formatDate(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const today = new Date()
const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
const filters = reactive({
  startDate: formatDate(monthStart),
  endDate: formatDate(today),
  labId: null,
})
const overview = ref({})
const list = ref([])
const labOptions = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

function formatRate(value) {
  const rate = Number(value ?? 0)
  return `${rate.toFixed(2)}%`
}

function rateTagType(value) {
  const rate = Number(value ?? 0)
  if (rate >= 80) return 'success'
  if (rate >= 50) return 'warning'
  return 'danger'
}

async function loadLabOptions() {
  const res = await getLabManageList({ page: 1, pageSize: 500 }).catch(() => ({ list: [] }))
  labOptions.value = res?.list ?? []
}

async function loadData() {
  const res = await getLabUsageStats({
    startDate: filters.startDate,
    endDate: filters.endDate,
    labId: filters.labId,
    page: page.value,
    pageSize: pageSize.value,
  }).catch(() => ({ overview: {}, list: [], total: 0 }))
  overview.value = res?.overview ?? {}
  list.value = res?.list ?? []
  total.value = res?.total ?? 0

  const maxPage = Math.max(1, Math.ceil(total.value / pageSize.value))
  if (page.value > maxPage) {
    page.value = maxPage
    await loadData()
  }
}

function handleSearch() {
  page.value = 1
  loadData()
}

onMounted(async () => {
  await loadLabOptions()
  loadData()
})
</script>

<style scoped lang="scss">
.filter-form {
  margin-bottom: 16px;
}

.overview-row {
  margin-bottom: 16px;
}

.overview-card {
  text-align: center;

  .value {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .label {
    font-size: 13px;
    color: #909399;
  }
}

.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>

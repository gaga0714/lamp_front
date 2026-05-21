<template>
  <div class="lab-list">
    <el-card>
      <template #header>
        <span>实验室查询与预约</span>
      </template>
      <el-form :inline="true" class="filter-form">
        <el-form-item label="实验室名称">
          <el-select v-model="filters.name" placeholder="全部" clearable filterable style="width: 220px">
            <el-option v-for="item in nameOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="预约日期">
          <el-date-picker
            v-model="filters.date"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
            style="width: 180px"
            :disabled-date="disabledPastDate"
          />
        </el-form-item>
        <el-form-item label="预约时段">
          <el-select v-model="filters.slot" placeholder="全部" clearable style="width: 160px">
            <el-option v-for="item in slotOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="最小容量">
          <el-input-number v-model="filters.minCapacity" :min="1" :max="200" controls-position="right" style="width: 140px" />
        </el-form-item>
        <el-form-item label="位置">
          <el-select v-model="filters.location" placeholder="全部" clearable filterable style="width: 160px">
            <el-option v-for="item in locationOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备">
          <el-select v-model="filters.equipment" placeholder="全部" clearable filterable style="width: 180px">
            <el-option v-for="item in equipmentOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="filters.onlyAvailable">仅看可预约</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="result-summary">{{ resultSummaryText }}</div>
      <div class="lab-cards">
        <el-card v-for="item in list" :key="item.id" shadow="hover" class="lab-card" @click="goDetail(item)">
          <div class="lab-id">实验室编号：{{ formatLabCode(item.id) }}</div>
          <div class="lab-name">{{ item.name }}</div>
          <div class="lab-location">{{ item.location || '暂无位置' }}</div>
          <div class="lab-desc">{{ item.description || '暂无描述' }}</div>
          <div class="lab-equipment">{{ item.equipmentInfo || '暂无设备信息' }}</div>
          <div class="lab-meta">
            <span>容量：{{ item.capacity ?? '-' }}人</span>
            <el-tag :type="item.status === 'available' ? 'success' : 'info'" size="small">
              {{ item.status === 'available' ? '可预约' : '维护中' }}
            </el-tag>
          </div>
          <div v-if="appliedFilters.date && appliedFilters.slot" class="lab-availability">
            <el-tag :type="item.currentSlotAvailable ? 'success' : 'warning'" size="small">
              {{ item.currentSlotAvailable ? '当前时段可预约' : '当前时段不可预约' }}
            </el-tag>
          </div>
        </el-card>
      </div>
      <el-empty v-if="list.length === 0" description="暂无实验室" />
      <el-pagination
        v-model:current-page="page"
        :total="total"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        class="pagination"
        @current-change="loadList"
      />
    </el-card>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getLabList, getLabFilterOptions } from '@/api/lab'
import { formatLabCode } from '@/utils/format'

const router = useRouter()
const list = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(8)
const filters = reactive({
  name: '',
  date: '',
  slot: '',
  minCapacity: null,
  onlyAvailable: false,
  location: '',
  equipment: '',
})
const appliedFilters = reactive({
  name: '',
  date: '',
  slot: '',
  minCapacity: null,
  onlyAvailable: false,
  location: '',
  equipment: '',
})
const nameOptions = ref([])
const slotOptions = ref(['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'])
const locationOptions = ref([])
const equipmentOptions = ref([])
const hasActiveFilters = computed(() => {
  return !!(
    appliedFilters.name ||
    appliedFilters.date ||
    appliedFilters.slot ||
    appliedFilters.minCapacity ||
    appliedFilters.onlyAvailable ||
    appliedFilters.location ||
    appliedFilters.equipment
  )
})
const resultSummaryText = computed(() => {
  return hasActiveFilters.value ? `当前筛选匹配 ${total.value} 个实验室` : `当前共有 ${total.value} 个实验室`
})

function resolvePageSize() {
  const width = window.innerWidth
  if (width >= 1400) return 8
  if (width >= 1100) return 6
  if (width >= 768) return 4
  return 3
}

function disabledPastDate(time) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return time.getTime() < today.getTime()
}

async function loadFilterOptions() {
  const res = await getLabFilterOptions().catch(() => ({}))
  if (res?.names) nameOptions.value = res.names
  if (res?.locations) locationOptions.value = res.locations
  if (res?.equipmentKeywords) equipmentOptions.value = res.equipmentKeywords
  if (res?.slots) slotOptions.value = res.slots
}

async function syncResponsivePageSize() {
  const nextSize = resolvePageSize()
  if (nextSize !== pageSize.value) {
    pageSize.value = nextSize
    page.value = 1
    await loadList()
  }
}

async function loadList() {
  const res = await getLabList({
    name: appliedFilters.name || undefined,
    date: appliedFilters.date || undefined,
    slot: appliedFilters.slot || undefined,
    minCapacity: appliedFilters.minCapacity ?? undefined,
    onlyAvailable: appliedFilters.onlyAvailable || undefined,
    location: appliedFilters.location || undefined,
    equipment: appliedFilters.equipment || undefined,
    page: page.value,
    pageSize: pageSize.value,
  }).catch(() => ({}))
  list.value = res?.list ?? res?.records ?? []
  total.value = res?.total ?? 0
  if (total.value > 0 && list.value.length === 0 && page.value > 1) {
    page.value = Math.ceil(total.value / pageSize.value)
    await loadList()
  }
}

function handleSearch() {
  appliedFilters.name = filters.name
  appliedFilters.date = filters.date
  appliedFilters.slot = filters.slot
  appliedFilters.minCapacity = filters.minCapacity
  appliedFilters.onlyAvailable = filters.onlyAvailable
  appliedFilters.location = filters.location
  appliedFilters.equipment = filters.equipment
  page.value = 1
  loadList()
}

function resetFilters() {
  filters.name = ''
  filters.date = ''
  filters.slot = ''
  filters.minCapacity = null
  filters.onlyAvailable = false
  filters.location = ''
  filters.equipment = ''
  appliedFilters.name = ''
  appliedFilters.date = ''
  appliedFilters.slot = ''
  appliedFilters.minCapacity = null
  appliedFilters.onlyAvailable = false
  appliedFilters.location = ''
  appliedFilters.equipment = ''
  page.value = 1
  loadList()
}

function goDetail(item) {
  const query = {}
  if (appliedFilters.date) query.date = appliedFilters.date
  if (appliedFilters.slot) query.slot = appliedFilters.slot
  if (appliedFilters.onlyAvailable) query.onlyAvailable = 'true'
  router.push({ path: `/lab/detail/${item.id}`, query })
}

onMounted(async () => {
  pageSize.value = resolvePageSize()
  window.addEventListener('resize', syncResponsivePageSize)
  await loadFilterOptions()
  await loadList()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncResponsivePageSize)
})
</script>

<style lang="scss" scoped>
.filter-form {
  margin-bottom: 16px;
}
.result-summary {
  font-size: 14px;
  color: #606266;
}
.lab-cards {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
.lab-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  .lab-id {
    font-size: 12px;
    color: #909399;
    margin-bottom: 6px;
  }
  .lab-name {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .lab-location {
    font-size: 12px;
    color: #606266;
    margin-bottom: 8px;
  }
  .lab-desc {
    font-size: 13px;
    color: #909399;
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .lab-equipment {
    font-size: 12px;
    color: #606266;
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .lab-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #909399;
  }
  .lab-availability {
    margin-top: 10px;
  }
}

@media (max-width: 767px) {
  .filter-form {
    :deep(.el-form-item) {
      display: flex;
      width: 100%;
      margin-right: 0;
    }

    :deep(.el-form-item__content) {
      width: 100%;
    }
  }

  .lab-cards {
    grid-template-columns: 1fr;
  }
}
</style>

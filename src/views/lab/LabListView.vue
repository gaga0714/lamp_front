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
          <el-date-picker v-model="filters.date" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 180px" />
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
      <el-row :gutter="16" class="lab-cards">
        <el-col v-for="item in list" :key="item.id" :span="6">
          <el-card shadow="hover" class="lab-card" @click="goDetail(item)">
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
        </el-col>
      </el-row>
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
import { computed, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getLabList } from '@/api/lab'
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
const nameOptions = [
  '智能感知实验室',
  '数据智能实验室',
  '嵌入式系统实验室',
  '网络空间安全实验室',
  '机器视觉实验室',
  '云计算与大数据实验室',
  '机器人控制实验室',
  '软件工程实验室',
  '虚拟仿真实验室',
  '智慧医疗实验室',
]
const slotOptions = ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00']
const locationOptions = ['一教', '二教', '三教', '四教南', '六教南', '七教北', '十教', '十二教']
const equipmentOptions = [
  '高性能工作站',
  'GPU服务器',
  '投影仪',
  '会议显示屏',
  '工业相机',
  '示波器',
  '机械臂平台',
  'PLC控制器',
  'FPGA开发板',
  '白板',
  '录播设备',
  '传感器平台',
  '虚拟现实设备',
  '3D打印机',
  '服务器集群',
]
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

onMounted(loadList)
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
}
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
.lab-card {
  cursor: pointer;
  margin-bottom: 16px;
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
</style>

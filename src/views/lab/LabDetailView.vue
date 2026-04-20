<template>
  <div class="lab-detail">
    <el-card v-loading="loading" class="detail-card">
      <template #header>
        <div class="header-row">
          <div>
            <div class="header-title">{{ detail?.name ?? '实验室详情' }}</div>
            <div class="header-subtitle">查询指定日期可预约时段，并在本页直接完成预约</div>
          </div>
          <el-button @click="router.back()">返回</el-button>
        </div>
      </template>

      <div v-if="detail" class="detail-content">
        <section class="detail-grid">
          <div class="detail-item">
            <span class="label">实验室编号</span>
            <span class="value">{{ formatLabCode(detail.id) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">位置</span>
            <span class="value">{{ detail.location || '暂无' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">容量</span>
            <span class="value">{{ detail.capacity ?? '-' }} 人</span>
          </div>
          <div class="detail-item">
            <span class="label">状态</span>
            <span class="value">
              <el-tag :type="detail.status === 'available' ? 'success' : 'info'">
                {{ detail.status === 'available' ? '可预约' : '维护中' }}
              </el-tag>
            </span>
          </div>
          <div class="detail-item full">
            <span class="label">可用设备</span>
            <span class="value">{{ detail.equipmentInfo || '暂无' }}</span>
          </div>
          <div class="detail-item full">
            <span class="label">描述</span>
            <span class="value">{{ detail.description || '暂无' }}</span>
          </div>
        </section>

        <el-divider />

        <section class="booking-panel">
          <div class="section-header">
            <div>
              <h3>实验室可预约时段</h3>
              <p>默认展示今天的时段状态，选择其他日期后自动刷新。</p>
            </div>
          </div>

          <el-form :inline="true" class="date-form">
            <el-form-item label="预约日期">
              <el-date-picker
                v-model="selectedDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择日期"
                style="width: 190px"
                :disabled-date="disabledPastDate"
                @change="handleDateChange"
              />
            </el-form-item>
          </el-form>

          <div v-loading="slotLoading" class="timeline-wrap">
            <button
              v-for="item in slotStatusList"
              :key="item.slot"
              type="button"
              class="time-slot"
              :class="[
                item.status,
                { selected: selectedSlot === item.slot && item.available },
              ]"
              @click="selectSlot(item)"
            >
              <span class="slot-time">{{ item.slot }}</span>
              <span class="slot-state">{{ item.statusText }}</span>
            </button>
          </div>

          <div class="slot-tip">
            <el-tag v-if="selectedSlot" type="primary" effect="light">已选择时段：{{ selectedSlot }}</el-tag>
            <span v-else>请选择上方可预约时段后填写预约信息。</span>
          </div>

          <el-divider />

          <section class="form-panel">
            <div class="section-header compact">
              <div>
                <h3>预约信息填写</h3>
                <p v-if="canBook">选择时段后即可直接提交预约申请。</p>
                <p v-else>当前角色仅可查看实验室信息与时段状态，不能发起预约。</p>
              </div>
            </div>

            <el-alert
              v-if="!canBook"
              type="info"
              :closable="false"
              title="仅学生和教师可提交实验室预约"
              show-icon
            />

            <el-form
              v-else
              ref="formRef"
              :model="form"
              :rules="rules"
              label-width="100px"
              class="booking-form"
            >
              <el-form-item label="实验室">
                <el-input :model-value="`${formatLabCode(detail.id)} ${detail.name}`" disabled />
              </el-form-item>
              <el-form-item label="预约日期">
                <el-input :model-value="selectedDate" disabled />
              </el-form-item>
              <el-form-item label="预约时段" prop="slot">
                <el-input v-model="form.slot" placeholder="请先选择可预约时段" readonly />
              </el-form-item>
              <el-form-item label="用途/人数" prop="purpose">
                <el-input
                  v-model="form.purpose"
                  type="textarea"
                  :rows="4"
                  placeholder="请填写预约用途、参与人数或实验安排"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="submitting" @click="submitBooking">提交预约</el-button>
              </el-form-item>
            </el-form>
          </section>
        </section>
      </div>
      <el-empty v-else description="实验室详情加载失败，请刷新后重试" />
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createBooking, getLabDetail, getLabSlotStatus } from '@/api/lab'
import { useUserStore } from '@/stores/user'
import { formatLabCode } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const id = computed(() => route.params.id)

const detail = ref(null)
const slotStatusList = ref([])
const selectedSlot = ref('')
const selectedDate = ref(resolveInitialDate())
const loading = ref(false)
const slotLoading = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const form = reactive({
  slot: '',
  purpose: '',
})
const rules = {
  slot: [{ required: true, message: '请选择预约时段', trigger: 'change' }],
  purpose: [{ required: true, message: '请填写用途/人数', trigger: 'blur' }],
}

const canBook = computed(() => ['student', 'teacher'].includes(userStore.role))

function formatDate(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function resolveInitialDate() {
  if (!route.query.date) {
    return formatDate(new Date())
  }
  const today = formatDate(new Date())
  return route.query.date < today ? today : route.query.date
}

function disabledPastDate(time) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return time.getTime() < today.getTime()
}

async function loadPage() {
  if (!id.value) return
  loading.value = true
  try {
    detail.value = await getLabDetail(id.value)
    await loadSlotStatus()

    const preferredSlot = route.query.slot && route.query.date === selectedDate.value ? route.query.slot : ''
    if (preferredSlot) {
      const matched = slotStatusList.value.find((item) => item.slot === preferredSlot && item.available)
      if (matched) {
        selectSlot(matched)
        return
      }
    }

    if (!slotStatusList.value.find((item) => item.slot === selectedSlot.value && item.available)) {
      clearSlotSelection()
    }
  } finally {
    loading.value = false
  }
}

async function loadSlotStatus() {
  slotLoading.value = true
  try {
    const slotRes = await getLabSlotStatus(id.value, { date: selectedDate.value })
    slotStatusList.value = slotRes?.list ?? []
  } catch (_error) {
    slotStatusList.value = [
      '08:00-10:00',
      '10:00-12:00',
      '14:00-16:00',
      '16:00-18:00',
      '18:00-20:00',
      '20:00-22:00',
    ].map((slot) => ({
      slot,
      available: false,
      status: 'occupied',
      statusText: '状态加载失败',
    }))
    ElMessage.error('可预约时段加载失败，请稍后重试')
  } finally {
    slotLoading.value = false
  }
}

function clearSlotSelection() {
  selectedSlot.value = ''
  form.slot = ''
}

function selectSlot(item) {
  if (!item.available) return
  selectedSlot.value = item.slot
  form.slot = item.slot
}

async function handleDateChange() {
  clearSlotSelection()
  await loadPage()
}

async function submitBooking() {
  const valid = await formRef.value?.validate().then(() => true).catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await createBooking({
      labId: Number(id.value),
      date: selectedDate.value,
      slot: form.slot,
      purpose: form.purpose,
    })
    ElMessage.success('预约提交成功')
    router.push('/lab/my-bookings')
  } finally {
    submitting.value = false
  }
}

onMounted(loadPage)
</script>

<style lang="scss" scoped>
.detail-card {
  border-radius: 20px;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.header-title {
  font-size: 22px;
  font-weight: 700;
  color: #2f4f6f;
}

.header-subtitle {
  margin-top: 6px;
  color: #7d8c9a;
  font-size: 13px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 18px;
}

.detail-item {
  padding: 14px 16px;
  border-radius: 16px;
  background: #f8fbfe;
  border: 1px solid rgba(47, 79, 111, 0.08);

  &.full {
    grid-column: 1 / -1;
  }

  .label {
    display: block;
    margin-bottom: 8px;
    color: #7b8b99;
    font-size: 12px;
  }

  .value {
    color: #314659;
    line-height: 1.7;
  }
}

.booking-panel {
  margin-top: 8px;
}

.section-header {
  margin-bottom: 16px;

  h3 {
    font-size: 18px;
    color: #2f4f6f;
  }

  p {
    margin-top: 6px;
    color: #7d8c9a;
    line-height: 1.6;
  }

  &.compact {
    margin-bottom: 12px;
  }
}

.date-form {
  margin-bottom: 12px;
}

.timeline-wrap {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  position: relative;
}

.time-slot {
  width: 100%;
  border: 1px solid #d9e3ec;
  border-radius: 14px;
  padding: 14px 16px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  .slot-time {
    display: block;
    font-size: 15px;
    font-weight: 700;
    color: #314659;
  }

  .slot-state {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    color: #7d8c9a;
  }

  &.available:hover {
    border-color: #4e72aa;
    transform: translateY(-2px);
  }

  &.available.selected {
    border-color: #4e72aa;
    background: #eef5fb;
    box-shadow: 0 10px 24px rgba(78, 114, 170, 0.12);
  }

  &.occupied {
    background: #f7f7f8;
    cursor: not-allowed;

    .slot-state {
      color: #c48f4a;
    }
  }

  &.expired {
    background: #f6f7fa;
    cursor: not-allowed;

    .slot-state {
      color: #be5c5c;
    }
  }

  &.maintenance {
    background: #f5f6f8;
    cursor: not-allowed;

    .slot-state {
      color: #909399;
    }
  }
}

.slot-tip {
  margin-top: 14px;
  color: #7d8c9a;
  font-size: 13px;
}

.form-panel {
  margin-top: 8px;
}

.booking-form {
  max-width: 640px;
}

@media (max-width: 991px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .timeline-wrap {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .header-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .timeline-wrap {
    grid-template-columns: 1fr;
  }
}
</style>

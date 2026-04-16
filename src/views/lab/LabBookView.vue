<template>
  <div class="lab-book">
    <el-card>
      <template #header>
        <span>预约实验室</span>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="max-width: 500px">
        <el-form-item label="实验室" prop="labId">
          <el-select v-model="form.labId" placeholder="请选择实验室" style="width: 100%" filterable>
            <el-option
              v-for="item in labList"
              :key="item.id"
              :label="`#${item.id} ${item.name}${item.location ? `（${item.location}）` : ''}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="预约日期" prop="date">
          <el-date-picker v-model="form.date" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="时段" prop="slot">
          <el-select v-model="form.slot" placeholder="请选择时段" style="width: 100%">
            <el-option label="08:00-10:00" value="08:00-10:00" />
            <el-option label="10:00-12:00" value="10:00-12:00" />
            <el-option label="14:00-16:00" value="14:00-16:00" />
            <el-option label="16:00-18:00" value="16:00-18:00" />
            <el-option label="18:00-20:00" value="18:00-20:00" />
            <el-option label="20:00-22:00" value="20:00-22:00" />
          </el-select>
        </el-form-item>
        <el-form-item label="用途/人数" prop="purpose">
          <el-input v-model="form.purpose" type="textarea" :rows="3" placeholder="请简要说明用途及人数" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSubmit">提交预约</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getLabList } from '@/api/lab'
import { createBooking } from '@/api/lab'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const labList = ref([])
const form = reactive({
  labId: undefined,
  date: '',
  slot: '',
  purpose: '',
})
const rules = {
  labId: [{ required: true, message: '请选择实验室', trigger: 'change' }],
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  slot: [{ required: true, message: '请选择时段', trigger: 'change' }],
  purpose: [{ required: true, message: '请填写用途', trigger: 'blur' }],
}

async function loadLabs() {
  const res = await getLabList().catch(() => ({}))
  labList.value = res?.list ?? res?.records ?? []
  if (route.query.id) form.labId = Number(route.query.id)
  if (route.query.date) form.date = route.query.date
  if (route.query.slot) form.slot = route.query.slot
}

async function onSubmit() {
  await formRef.value?.validate().catch(() => {})
  loading.value = true
  try {
    await createBooking(form)
    ElMessage.success('预约提交成功')
    router.push('/lab/my-bookings')
  } finally {
    loading.value = false
  }
}

onMounted(loadLabs)
</script>

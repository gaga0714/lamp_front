<template>
  <div class="leave-apply">
    <el-card>
      <template #header>
        <span>课程请假</span>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="max-width: 500px">
        <el-form-item label="上课日期" prop="courseDate">
          <el-date-picker
            v-model="form.courseDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择上课日期"
            style="width: 100%"
            :disabled-date="disabledPastDate"
            @change="loadCourseOptions"
          />
        </el-form-item>
        <el-form-item label="请假课程" prop="courseId">
          <el-select v-model="form.courseId" placeholder="请选择课程" style="width: 100%">
            <el-option
              v-for="item in courseOptions"
              :key="item.id"
              :label="`${item.courseCode} ${item.courseName}（${item.courseTime}）`"
              :value="item.id"
            />
          </el-select>
          <div class="course-tip">
            仅显示今天及以后、且尚未上过或未提交过请假的课程。
          </div>
        </el-form-item>
        <el-form-item label="请假类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择" style="width: 100%">
            <el-option label="事假" value="personal" />
            <el-option label="病假" value="sick" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="请假事由" prop="reason">
          <el-input v-model="form.reason" type="textarea" :rows="4" placeholder="请输入请假事由" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSubmit">提交申请</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { applyLeave } from '@/api/attendance'
import { getStudentLeaveCourseOptions } from '@/api/course'

const formRef = ref(null)
const loading = ref(false)
const courseOptions = ref([])

function formatDate(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getTodayStart() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

function disabledPastDate(date) {
  return date.getTime() < getTodayStart().getTime()
}

const form = reactive({
  courseDate: formatDate(new Date()),
  courseId: '',
  type: 'personal',
  reason: '',
})
const rules = {
  courseDate: [
    { required: true, message: '请选择上课日期', trigger: 'change' },
    {
      validator: (_rule, value, callback) => {
        if (!value) {
          callback()
          return
        }
        if (new Date(value).getTime() < getTodayStart().getTime()) {
          callback(new Error('不能申请今天之前的课程请假'))
          return
        }
        callback()
      },
      trigger: 'change',
    },
  ],
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
  type: [{ required: true, message: '请选择请假类型', trigger: 'change' }],
  reason: [{ required: true, message: '请输入请假事由', trigger: 'blur' }],
}

async function loadCourseOptions() {
  if (!form.courseDate || new Date(form.courseDate).getTime() < getTodayStart().getTime()) {
    courseOptions.value = []
    form.courseId = ''
    return
  }
  const res = await getStudentLeaveCourseOptions({ date: form.courseDate }).catch(() => ({ list: [] }))
  courseOptions.value = res?.list ?? []
  if (!courseOptions.value.some(item => item.id === form.courseId)) {
    form.courseId = ''
  }
}

async function onSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }
  loading.value = true
  try {
    await applyLeave(form)
    ElMessage.success('提交成功')
    formRef.value?.resetFields()
    form.courseDate = formatDate(new Date())
    await loadCourseOptions()
  } finally {
    loading.value = false
  }
}

onMounted(loadCourseOptions)
</script>

<style scoped lang="scss">
.course-tip {
  margin-top: 6px;
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}
</style>

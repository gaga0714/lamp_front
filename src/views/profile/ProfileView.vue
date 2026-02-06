<template>
  <div class="profile">
    <el-card>
      <template #header>
        <span>个人资料</span>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="max-width: 400px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { updateProfile } from '@/api/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)
const form = reactive({
  username: '',
  name: '',
  phone: '',
  email: '',
})
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
}

function initForm() {
  const u = userStore.userInfo
  if (u) {
    form.username = u.username ?? u.account ?? ''
    form.name = u.name ?? u.realName ?? ''
    form.phone = u.phone ?? ''
    form.email = u.email ?? ''
  }
}

async function onSubmit() {
  await formRef.value?.validate().catch(() => {})
  loading.value = true
  try {
    await updateProfile(form)
    userStore.userInfo = { ...userStore.userInfo, ...form }
    ElMessage.success('保存成功')
  } finally {
    loading.value = false
  }
}

onMounted(initForm)
</script>

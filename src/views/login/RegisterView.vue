<template>
  <div class="register-page">
    <div class="auth-shell">
      <section class="brand-panel">
        <div class="brand-badge">新用户注册</div>
        <h1>创建你的系统账号</h1>
        <p class="brand-desc">
          学生和教师可通过注册直接进入系统，完成课程考勤、请假与实验室预约相关操作。
        </p>
        <div class="role-tips">
          <el-tag effect="light" round>研究生</el-tag>
          <el-tag effect="light" round>教师</el-tag>
        </div>
      </section>

      <el-card class="register-card" shadow="never">
        <div class="card-head">
          <h2>账号注册</h2>
          <p>请如实填写基本信息，注册后可直接登录系统。</p>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" @submit.prevent="onSubmit">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="学号 / 工号" size="large" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="真实姓名" size="large" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" size="large" show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" placeholder="再次输入密码" size="large" show-password />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%" size="large">
              <el-option label="研究生" value="student" />
              <el-option label="教师" value="teacher" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" class="submit-btn" @click="onSubmit">注册</el-button>
            <router-link to="/login" class="back-link">返回登录</router-link>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { register } from '@/api/auth'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const form = reactive({
  username: '',
  name: '',
  password: '',
  confirmPassword: '',
  role: 'student',
})
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, cb) => (value === form.password ? cb() : cb(new Error('两次密码不一致'))),
      trigger: 'blur',
    },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

async function onSubmit() {
  await formRef.value?.validate().catch(() => {})
  loading.value = true
  try {
    await register({
      username: form.username,
      name: form.name,
      password: form.password,
      role: form.role,
    })
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(125, 165, 210, 0.18), transparent 30%),
    linear-gradient(180deg, #f5f9fd 0%, #e9f0f7 100%);
}

.auth-shell {
  width: min(1080px, 100%);
  display: grid;
  grid-template-columns: 1.02fr 0.98fr;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(47, 79, 111, 0.08);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 18px 48px rgba(47, 79, 111, 0.12);
}

.brand-panel {
  padding: 52px 44px;
  background: linear-gradient(180deg, #f7fbff 0%, #eef5fb 100%);

  .brand-badge {
    display: inline-flex;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(78, 114, 170, 0.1);
    color: #4e72aa;
    font-size: 13px;
    margin-bottom: 20px;
  }

  h1 {
    font-size: 32px;
    color: #2f4f6f;
    margin-bottom: 18px;
  }

  .brand-desc {
    color: #5d6f81;
    line-height: 1.9;
    max-width: 480px;
  }
}

.role-tips {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.register-card {
  margin: 24px;
  border: none;
  border-radius: 24px;
  align-self: center;

  :deep(.el-card__body) {
    padding: 32px 30px;
  }
}

.card-head {
  margin-bottom: 20px;

  h2 {
    font-size: 28px;
    color: #2f4f6f;
    margin-bottom: 8px;
  }

  p {
    color: #7d8c9a;
  }
}

.submit-btn {
  min-width: 120px;
  border-radius: 12px;
}

.back-link {
  margin-left: 14px;
  color: #4e72aa;
  font-weight: 600;
}

@media (max-width: 991px) {
  .auth-shell {
    grid-template-columns: 1fr;
  }

  .brand-panel {
    padding: 34px 28px 16px;

    h1 {
      font-size: 28px;
    }
  }

  .register-card {
    margin: 0 18px 18px;
  }
}

@media (max-width: 767px) {
  .register-page {
    padding: 14px;
  }

  .brand-panel {
    padding: 26px 22px 14px;
  }

  .register-card {
    margin: 0 12px 12px;

    :deep(.el-card__body) {
      padding: 24px 18px;
    }
  }
}
</style>

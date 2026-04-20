<template>
  <div class="login-page">
    <div class="auth-shell">
      <section class="brand-panel">
        <div class="brand-badge">校园平台</div>
        <h1>研究生考勤及实验室预约系统</h1>
        <p class="brand-desc">
          面向学生、教师与实验室管理员的课程考勤、请假审批与实验室预约一体化平台。
        </p>
        <div class="feature-list">
          <div class="feature-item">课程签到与课程请假联动</div>
          <div class="feature-item">实验室预约、签到、签退闭环</div>
          <div class="feature-item">实验室真实使用率统计展示</div>
        </div>
      </section>

      <el-card class="login-card" shadow="never">
        <div class="card-head">
          <h2>欢迎登录</h2>
          <p>请输入账号与密码进入系统</p>
        </div>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="0" @submit.prevent="onSubmit">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="用户名 / 学号 / 工号" prefix-icon="User" size="large" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              prefix-icon="Lock"
              size="large"
              show-password
              @keyup.enter="onSubmit"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" :loading="loading" class="submit-btn" @click="onSubmit">
              登录
            </el-button>
          </el-form-item>
          <div class="tips">
            <span>还没有账号？</span>
            <router-link to="/register">去注册</router-link>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
})
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function onSubmit() {
  await formRef.value?.validate().catch(() => {})
  loading.value = true
  try {
    await userStore.login(form)
    ElMessage.success('登录成功')
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
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
  grid-template-columns: 1.1fr 0.9fr;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(47, 79, 111, 0.08);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 18px 48px rgba(47, 79, 111, 0.12);
}

.brand-panel {
  padding: 56px 48px;
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
    font-size: 34px;
    line-height: 1.35;
    color: #2f4f6f;
    margin-bottom: 18px;
  }

  .brand-desc {
    color: #5d6f81;
    line-height: 1.9;
    max-width: 520px;
  }
}

.feature-list {
  margin-top: 28px;
  display: grid;
  gap: 12px;
}

.feature-item {
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(47, 79, 111, 0.08);
  color: #44586d;
}

.login-card {
  margin: 24px;
  border: none;
  border-radius: 24px;
  align-self: center;

  :deep(.el-card__body) {
    padding: 36px 34px;
  }
}

.card-head {
  margin-bottom: 22px;

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
  width: 100%;
  border-radius: 12px;
}

.tips {
  text-align: center;
  color: #7d8c9a;

  a {
    margin-left: 6px;
    color: #4e72aa;
    font-weight: 600;
  }
}

@media (max-width: 991px) {
  .auth-shell {
    grid-template-columns: 1fr;
  }

  .brand-panel {
    padding: 40px 30px 20px;

    h1 {
      font-size: 28px;
    }
  }

  .login-card {
    margin: 0 20px 20px;
  }
}

@media (max-width: 767px) {
  .login-page {
    padding: 14px;
  }

  .brand-panel {
    padding: 28px 22px 14px;
  }

  .login-card {
    margin: 0 12px 12px;

    :deep(.el-card__body) {
      padding: 24px 20px;
    }
  }
}
</style>

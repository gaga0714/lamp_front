<template>
  <div class="dashboard">
    <h2>工作台</h2>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="40" color="#409eff"><Calendar /></el-icon>
            <div>
              <div class="stat-value">0</div>
              <div class="stat-label">本月签到天数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="40" color="#67c23a"><OfficeBuilding /></el-icon>
            <div>
              <div class="stat-value">0</div>
              <div class="stat-label">我的预约</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="40" color="#e6a23c"><Document /></el-icon>
            <div>
              <div class="stat-value">0</div>
              <div class="stat-label">待审批请假</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="40" color="#f56c6c"><Bell /></el-icon>
            <div>
              <div class="stat-value">0</div>
              <div class="stat-label">待办事项</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="quick-actions" shadow="hover">
      <template #header>快捷入口</template>
      <div class="actions">
        <el-button type="primary" @click="$router.push('/attendance/check-in')">考勤签到</el-button>
        <el-button @click="$router.push('/attendance/records')">考勤记录</el-button>
        <el-button @click="$router.push('/attendance/leave/apply')">请假申请</el-button>
        <el-button @click="$router.push('/lab/list')">实验室列表</el-button>
        <el-button @click="$router.push('/lab/my-bookings')">我的预约</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// 工作台：统计卡片 + 快捷入口，后续可接真实接口
</script>

<style lang="scss" scoped>
.dashboard {
  h2 {
    margin-bottom: 20px;
    font-size: 20px;
  }
}
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  .stat-value {
    font-size: 24px;
    font-weight: 600;
  }
  .stat-label {
    font-size: 14px;
    color: #909399;
  }
}
.quick-actions {
  margin-top: 20px;
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>

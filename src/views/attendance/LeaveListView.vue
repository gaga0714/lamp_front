<template>
  <div class="leave-list">
    <el-card>
      <template #header>
        <span>我的课程请假</span>
      </template>
      <el-table :data="list" border stripe>
        <el-table-column prop="courseCode" label="课程编号" width="120" />
        <el-table-column prop="courseName" label="课程名称" min-width="180" />
        <el-table-column prop="teacherName" label="授课教师" width="120" />
        <el-table-column prop="courseDate" label="日期" width="120" />
        <el-table-column prop="courseTime" label="上课时间" width="160" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            {{ { personal: '事假', sick: '病假', other: '其他' }[row.type] ?? row.type }}
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="事由" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === '待审批'" type="danger" link size="small" @click="handleCancel(row)">撤回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next"
        class="pagination"
        @current-change="loadList"
        @size-change="loadList"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cancelLeave, getLeaveList } from '@/api/attendance'

const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

function statusType(s) {
  const map = { 待审批: 'warning', 已通过: 'success', 已驳回: 'danger' }
  return map[s] ?? 'info'
}

async function loadList() {
  const res = await getLeaveList({ page: page.value, pageSize: pageSize.value }).catch(() => ({ list: [], total: 0 }))
  list.value = res?.list ?? res?.records ?? []
  total.value = res?.total ?? 0
}

async function handleCancel(row) {
  await ElMessageBox.confirm('确定撤回这条请假申请？', '提示', { type: 'warning' })
  await cancelLeave(row.id)
  ElMessage.success('已撤回')
  loadList()
}

onMounted(loadList)
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>

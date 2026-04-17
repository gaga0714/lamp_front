<template>
  <div class="leave-approve">
    <el-card>
      <template #header>
        <span>请假审批</span>
      </template>
      <el-table :data="list" border stripe>
        <el-table-column prop="username" label="学号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            {{ typeMap[row.type] ?? row.type }}
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="170" />
        <el-table-column prop="endTime" label="结束时间" width="170" />
        <el-table-column prop="reason" label="事由" min-width="220" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="170" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="success" link size="small" @click="openDialog(row, true)">通过</el-button>
            <el-button type="danger" link size="small" @click="openDialog(row, false)">驳回</el-button>
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

    <el-dialog v-model="dialogVisible" :title="dialogApproved ? '通过请假申请' : '驳回请假申请'" width="420px">
      <div class="dialog-user">
        <span>申请人：</span>
        <span>{{ currentRow?.name }}（{{ currentRow?.username }}）</span>
      </div>
      <el-input
        v-model="remark"
        type="textarea"
        :rows="4"
        :placeholder="dialogApproved ? '可填写审批备注（选填）' : '可填写驳回原因（选填）'"
      />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitApprove">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { approveLeave, getPendingLeaveList } from '@/api/attendance'

const typeMap = { personal: '事假', sick: '病假', other: '其他' }
const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const dialogApproved = ref(true)
const currentRow = ref(null)
const remark = ref('')
const submitting = ref(false)

function statusType(status) {
  const map = { 待审批: 'warning', 已通过: 'success', 已驳回: 'danger' }
  return map[status] ?? 'info'
}

async function loadList() {
  const res = await getPendingLeaveList({ page: page.value, pageSize: pageSize.value }).catch(() => ({ list: [], total: 0 }))
  list.value = res?.list ?? res?.records ?? []
  total.value = res?.total ?? 0
}

function openDialog(row, approved) {
  currentRow.value = row
  dialogApproved.value = approved
  remark.value = ''
  dialogVisible.value = true
}

async function submitApprove() {
  if (!currentRow.value) return
  submitting.value = true
  try {
    await approveLeave(currentRow.value.id, { approved: dialogApproved.value, remark: remark.value })
    ElMessage.success(dialogApproved.value ? '审批通过' : '已驳回')
    dialogVisible.value = false
    loadList()
  } finally {
    submitting.value = false
  }
}

onMounted(loadList)
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}

.dialog-user {
  margin-bottom: 12px;
  color: #606266;
}
</style>

<template>
  <div class="lab-manage">
    <el-card>
      <template #header>
        <span>实验室管理</span>
        <el-button type="primary" style="float: right" @click="handleEdit()">新增实验室</el-button>
      </template>
      <el-table :data="list" border stripe>
        <el-table-column label="编号" width="90">
          <template #default="{ row }">
            {{ formatLabCode(row.id) }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="140" />
        <el-table-column prop="location" label="位置" width="180" show-overflow-tooltip />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="equipmentInfo" label="设备" width="220" show-overflow-tooltip />
        <el-table-column prop="capacity" label="容量" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'available' ? 'success' : 'info'">{{ row.status === 'available' ? '可预约' : '维护中' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
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
    <!-- 新增/编辑弹窗占位，后续可接表单 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getLabManageList, deleteLab } from '@/api/lab'
import { formatLabCode } from '@/utils/format'

const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

async function loadList() {
  const res = await getLabManageList({ page: page.value, pageSize: pageSize.value }).catch(() => ({ list: [], total: 0 }))
  list.value = res?.list ?? res?.records ?? []
  total.value = res?.total ?? 0
}

function handleEdit(row) {
  ElMessage.info('编辑功能请在后端对接后完善弹窗表单')
}

async function handleDelete(row) {
  await ElMessageBox.confirm('确定删除该实验室？', '提示', { type: 'warning' })
  await deleteLab(row.id)
  ElMessage.success('已删除')
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

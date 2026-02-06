<template>
  <div class="admin-users">
    <el-card>
      <template #header>
        <span>用户管理</span>
        <el-button type="primary" style="float: right" @click="handleEdit()">新增用户</el-button>
      </template>
      <el-form :inline="true" class="filter-form">
        <el-form-item label="关键词">
          <el-input v-model="keyword" placeholder="用户名/姓名" clearable />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="role" placeholder="全部" clearable style="width: 120px">
            <el-option label="研究生" value="student" />
            <el-option label="教师" value="teacher" />
            <el-option label="实验室管理员" value="labAdmin" />
            <el-option label="系统管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadList">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" border stripe>
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            {{ { student: '研究生', teacher: '教师', labAdmin: '实验室管理员', admin: '系统管理员' }[row.role] ?? row.role }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '正常' : '禁用' }}</el-tag>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getUserList, deleteUser } from '@/api/user'

const keyword = ref('')
const role = ref('')
const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

async function loadList() {
  const res = await getUserList({ page: page.value, pageSize: pageSize.value, keyword: keyword.value, role: role.value }).catch(() => ({ list: [], total: 0 }))
  list.value = res?.list ?? res?.records ?? []
  total.value = res?.total ?? 0
}

function handleEdit(row) {
  ElMessage.info('编辑功能请在后端对接后完善弹窗表单')
}

async function handleDelete(row) {
  await ElMessageBox.confirm('确定删除该用户？', '提示', { type: 'warning' })
  await deleteUser(row.id)
  ElMessage.success('已删除')
  loadList()
}

onMounted(loadList)
</script>

<style lang="scss" scoped>
.filter-form {
  margin-bottom: 16px;
}
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>

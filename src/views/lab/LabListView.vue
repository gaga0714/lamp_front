<template>
  <div class="lab-list">
    <el-card>
      <template #header>
        <span>实验室列表</span>
      </template>
      <el-input v-model="keyword" placeholder="搜索实验室名称" clearable style="width: 240px; margin-bottom: 16px" @keyup.enter="loadList" />
      <el-button type="primary" style="margin-left: 8px" @click="loadList">查询</el-button>
      <el-row :gutter="16" class="lab-cards">
        <el-col v-for="item in list" :key="item.id" :span="6">
          <el-card shadow="hover" class="lab-card" @click="$router.push(`/lab/detail/${item.id}`)">
            <div class="lab-name">{{ item.name }}</div>
            <div class="lab-location">{{ item.location || '暂无位置' }}</div>
            <div class="lab-desc">{{ item.description || '暂无描述' }}</div>
            <div class="lab-meta">
              <span>容量：{{ item.capacity ?? '-' }}人</span>
              <el-tag :type="item.status === 'available' ? 'success' : 'info'" size="small">
                {{ item.status === 'available' ? '可预约' : '维护中' }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-empty v-if="list.length === 0" description="暂无实验室" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getLabList } from '@/api/lab'

const keyword = ref('')
const list = ref([])

async function loadList() {
  const res = await getLabList({ keyword: keyword.value }).catch(() => ({}))
  list.value = res?.list ?? res?.records ?? []
}

onMounted(loadList)
</script>

<style lang="scss" scoped>
.lab-cards {
  margin-top: 16px;
}
.lab-card {
  cursor: pointer;
  margin-bottom: 16px;
  .lab-name {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .lab-location {
    font-size: 12px;
    color: #606266;
    margin-bottom: 8px;
  }
  .lab-desc {
    font-size: 13px;
    color: #909399;
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .lab-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #909399;
  }
}
</style>

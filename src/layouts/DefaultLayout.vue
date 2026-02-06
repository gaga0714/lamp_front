<template>
  <el-container class="default-layout">
    <el-aside width="220px" class="aside">
      <div class="logo">考勤·预约</div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        :unique-opened="true"
      >
        <template v-for="route in menuRoutes" :key="route.fullPath">
          <el-menu-item v-if="!route.meta?.hideMenu" :index="route.fullPath">
            <el-icon><component :is="route.meta?.icon || 'Document'" /></el-icon>
            <span>{{ route.meta?.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    <el-container direction="vertical">
      <el-header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentTitle">{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <span class="username">{{ userStore.userInfo?.username ?? userStore.userInfo?.name }}</span>
          <el-dropdown @command="handleCommand">
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                <el-dropdown-item command="password">修改密码</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import routes from '@/router/routes'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const currentTitle = computed(() => route.meta?.title ?? '')

// 从根路由的 children 里取菜单（过滤 hideMenu、按角色过滤），并转为绝对路径供 el-menu 跳转
const menuRoutes = computed(() => {
  const root = routes.find((r) => r.children)
  const children = root?.children ?? []
  const role = userStore.role
  return children
    .filter((r) => {
      if (r.meta?.hideMenu) return false
      const roles = r.meta?.roles
      if (roles?.length && !roles.includes(role)) return false
      return true
    })
    .map((r) => ({
      ...r,
      fullPath: r.path.startsWith('/') ? r.path : `/${r.path}`,
    }))
})

function handleCommand(cmd) {
  if (cmd === 'profile') router.push('/profile')
  if (cmd === 'password') router.push('/profile/password')
  if (cmd === 'logout') {
    userStore.logout()
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.default-layout {
  height: 100vh;
}
.aside {
  background-color: #304156;
  .logo {
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
  }
  .el-menu {
    border-right: none;
  }
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    .username {
      font-size: 14px;
      color: #606266;
    }
  }
}
.main {
  background: #f0f2f5;
  padding: 20px;
  overflow: auto;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <el-container class="default-layout">
    <el-aside v-if="!isMobile" :width="asideWidth" class="aside">
      <div class="logo" :class="{ collapsed }">
        <div class="logo-mark">研</div>
        <div v-if="!collapsed" class="logo-text">
          <div class="title">考勤·预约</div>
          <div class="subtitle">（{{ roleLabel }}）</div>
        </div>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        router
        background-color="#2f4f6f"
        text-color="#dbe7f3"
        active-text-color="#ffffff"
        :unique-opened="true"
        @select="handleMenuSelect"
      >
        <template v-for="menuRoute in menuRoutes" :key="menuRoute.fullPath">
          <el-menu-item v-if="!menuRoute.meta?.hideMenu" :index="menuRoute.fullPath">
            <el-icon><component :is="menuRoute.meta?.icon || 'Document'" /></el-icon>
            <template #title>{{ menuRoute.meta?.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-drawer
      v-model="mobileMenuVisible"
      direction="ltr"
      size="240px"
      :with-header="false"
      class="mobile-drawer"
    >
      <div class="mobile-menu">
        <div class="logo mobile">
          <div class="logo-mark">研</div>
          <div class="logo-text">
            <div class="title">考勤·预约</div>
            <div class="subtitle">（{{ roleLabel }}）</div>
          </div>
        </div>
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#2f4f6f"
          text-color="#dbe7f3"
          active-text-color="#ffffff"
          :unique-opened="true"
          @select="handleMenuSelect"
        >
          <template v-for="menuRoute in menuRoutes" :key="menuRoute.fullPath">
            <el-menu-item v-if="!menuRoute.meta?.hideMenu" :index="menuRoute.fullPath">
              <el-icon><component :is="menuRoute.meta?.icon || 'Document'" /></el-icon>
              <template #title>{{ menuRoute.meta?.title }}</template>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </el-drawer>

    <el-container direction="vertical">
      <el-header class="header">
        <div class="header-left">
          <el-button
            class="menu-trigger"
            text
            :icon="isMobile ? Expand : collapsed ? Expand : Fold"
            @click="toggleMenu"
          />
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentTitle">{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-tag effect="plain" type="info" class="role-tag">{{ roleLabel }}</el-tag>
          <span class="username">{{ userStore.userInfo?.username ?? userStore.userInfo?.name }}</span>
          <el-dropdown @command="handleCommand">
            <span class="user-entry">
              账号
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowDown, Expand, Fold } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import routes from '@/router/routes'

const DESKTOP_BREAKPOINT = 992

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const collapsed = ref(false)
const isMobile = ref(false)
const mobileMenuVisible = ref(false)

const activeMenu = computed(() => route.path)
const currentTitle = computed(() => route.meta?.title ?? '')
const roleLabel = computed(() => {
  const roleMap = {
    student: '学生',
    teacher: '教师',
    admin: '实验室管理员',
  }
  return roleMap[userStore.role] ?? '用户'
})
const asideWidth = computed(() => (collapsed.value ? '72px' : '236px'))

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

function syncLayoutState() {
  const mobile = window.innerWidth < DESKTOP_BREAKPOINT
  isMobile.value = mobile
  if (mobile) {
    mobileMenuVisible.value = false
    collapsed.value = false
  }
}

function toggleMenu() {
  if (isMobile.value) {
    mobileMenuVisible.value = !mobileMenuVisible.value
    return
  }
  collapsed.value = !collapsed.value
}

function handleMenuSelect() {
  if (isMobile.value) {
    mobileMenuVisible.value = false
  }
}

function handleCommand(cmd) {
  if (cmd === 'profile') router.push('/profile')
  if (cmd === 'password') router.push('/profile/password')
  if (cmd === 'logout') {
    userStore.logout()
    router.push('/login')
  }
}

onMounted(() => {
  syncLayoutState()
  window.addEventListener('resize', syncLayoutState)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncLayoutState)
})
</script>

<style lang="scss" scoped>
.default-layout {
  min-height: 100vh;
  background: #f4f7fb;
}

.aside {
  background: linear-gradient(180deg, #2f4f6f 0%, #355d82 100%);
  transition: width 0.25s ease;
  overflow: hidden;

  :deep(.el-menu) {
    border-right: none;
  }

  :deep(.el-menu-item) {
    border-radius: 10px;
    margin: 6px 10px;
  }

  :deep(.el-menu-item.is-active) {
    background: rgba(255, 255, 255, 0.16);
  }
}

.logo {
  height: 72px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;

  &.collapsed {
    justify-content: center;
    padding: 0;
  }

  &.mobile {
    margin-bottom: 8px;
    background: linear-gradient(180deg, #2f4f6f 0%, #355d82 100%);
  }

  .logo-mark {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 0.18);
    font-size: 18px;
    font-weight: 700;
  }

  .logo-text {
    min-width: 0;
  }

  .title {
    font-size: 17px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .subtitle {
    margin-top: 2px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.82);
  }
}

.mobile-drawer {
  :deep(.el-drawer__body) {
    padding: 0;
    background: #2f4f6f;
  }
}

.mobile-menu {
  min-height: 100%;
  background: #2f4f6f;

  :deep(.el-menu) {
    border-right: none;
  }
}

.header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  box-shadow: 0 6px 24px rgba(43, 69, 97, 0.08);

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.menu-trigger {
  color: #2f4f6f;
  font-size: 18px;
}

.role-tag {
  border-radius: 999px;
}

.username {
  font-size: 14px;
  color: #4b5d73;
}

.user-entry {
  display: inline-flex;
  align-items: center;
  color: #2f4f6f;
  cursor: pointer;
  font-size: 14px;
}

.main {
  background: linear-gradient(180deg, #f7f9fc 0%, #f3f6fa 100%);
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

@media (max-width: 991px) {
  .header {
    padding: 0 14px;

    .header-right {
      gap: 8px;
    }
  }

  .username {
    display: none;
  }

  .main {
    padding: 14px;
  }
}

@media (max-width: 767px) {
  .header {
    .role-tag {
      display: none;
    }
  }
}
</style>

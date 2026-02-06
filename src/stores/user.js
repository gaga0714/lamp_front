import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToken, setToken, getUser, setUser, clearAuth } from '@/utils/auth'
import { login as loginApi, getUserInfo } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const userInfo = ref(getUser())

  const isLoggedIn = computed(() => !!token.value)
  const role = computed(() => userInfo.value?.role ?? '')

  async function login(loginForm) {
    const data = await loginApi(loginForm)
    setToken(data.token)
    setUser(data.user ?? data)
    token.value = data.token
    userInfo.value = data.user ?? data
    return data
  }

  async function fetchUserInfo() {
    const data = await getUserInfo()
    setUser(data)
    userInfo.value = data
    return data
  }

  function logout() {
    clearAuth()
    token.value = ''
    userInfo.value = null
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    role,
    login,
    fetchUserInfo,
    logout,
  }
})
